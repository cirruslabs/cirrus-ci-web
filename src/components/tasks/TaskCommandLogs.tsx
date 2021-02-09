import React, { useEffect, useState } from 'react';
import Logs from '../logs/Logs';
import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import { subscribeTaskCommandLogs } from '../../rtu/ConnectionManager';
import CirrusCircularProgress from '../common/CirrusCircularProgress';
import { isTaskCommandFinalStatus } from '../../utils/status';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import GetApp from '@material-ui/icons/GetApp';
import Fab from '@material-ui/core/Fab';
import { TaskCommandLogsTailQuery } from './__generated__/TaskCommandLogsTailQuery.graphql';
import { TaskCommandStatus } from './__generated__/TaskCommandList_task.graphql';

function logURL(taskId: string, command) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/logs/' + command.name + '.log';
}

let styles = theme =>
  createStyles({
    actionButtons: {
      position: 'absolute',
      right: 0,
    },
    downloadButton: {
      margin: theme.spacing(1.0),
    },
  });

interface RealTimeLogsProps extends WithStyles<typeof styles> {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
  };
  initialLogLines: ReadonlyArray<string>;
}

function TaskCommandRealTimeLogs(props: RealTimeLogsProps) {
  let [realTimeLogs, setRealTimeLogs] = useState(!isTaskCommandFinalStatus(props.command.status));
  let [additionalLogs, setAdditionalLogs] = useState('\n');

  useEffect(() => {
    if (!realTimeLogs) return;
    let closable = subscribeTaskCommandLogs(props.taskId, props.command.name, newLogs => {
      // can be an object on a websocket reconnect
      if (typeof newLogs === 'string' || newLogs instanceof String) {
        setAdditionalLogs(additionalLogs + newLogs);
      }
    });
    return () => closable();
  }, [realTimeLogs, props.taskId, props.command.name]);

  let { classes, taskId, command, initialLogLines } = props;
  let inProgress = !isTaskCommandFinalStatus(command.status);
  let downloadButton = (
    <div className={classes.actionButtons}>
      <Fab
        variant="round"
        className={classes.downloadButton}
        href={logURL(taskId, command)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Tooltip title="Download Full Logs">
          <GetApp />
        </Tooltip>
      </Fab>
    </div>
  );
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {inProgress ? null : downloadButton}
      <Logs taskId={taskId} commandName={command.name} logs={initialLogLines.join('\n') + additionalLogs} />
      {inProgress ? <CirrusLinearProgress /> : null}
    </div>
  );
}

interface TaskCommandLogsProps extends WithStyles<typeof styles> {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
  };
}

function TaskCommandLogs(props: TaskCommandLogsProps) {
  return (
    <QueryRenderer<TaskCommandLogsTailQuery>
      environment={environment}
      variables={{ taskId: props.taskId, commandName: props.command.name }}
      query={graphql`
        query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
          task(id: $taskId) {
            commandLogsTail(name: $commandName)
          }
        }
      `}
      render={response => {
        if (!response.props) {
          return (
            <div style={{ width: '100%', minHeight: 100 }}>
              <div className="text-center">
                <CirrusCircularProgress />
              </div>
            </div>
          );
        }
        return <TaskCommandRealTimeLogs initialLogLines={response.props.task.commandLogsTail || []} {...props} />;
      }}
    />
  );
}

export default withStyles(styles)(TaskCommandLogs);
