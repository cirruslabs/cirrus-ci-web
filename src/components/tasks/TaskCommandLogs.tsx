import React, { useEffect, useState } from 'react';
import Logs from '../logs/Logs';
import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import { subscribeTaskCommandLogs } from '../../rtu/ConnectionManager';
import CirrusCircularProgress from '../common/CirrusCircularProgress';
import { isTaskCommandFinalStatus } from '../../utils/status';
import Tooltip from '@mui/material/Tooltip';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import GetApp from '@mui/icons-material/GetApp';
import Fab from '@mui/material/Fab';
import {
  TaskCommandLogsTailQuery,
  TaskCommandLogsTailQueryResponse,
} from './__generated__/TaskCommandLogsTailQuery.graphql';
import { TaskCommandStatus, TaskCommandType } from './__generated__/TaskCommandList_task.graphql';

function logURL(taskId: string, command) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/logs/' + command.name + '.log';
}

function cacheURL(taskId: string, executionInfo) {
  let cacheKey = executionInfo.cacheRetrievalAttempts.hits[0].key;
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/caches/' + cacheKey + '.tar.gz';
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
    type: TaskCommandType;
  };
  initialLogLines: ReadonlyArray<string>;
  executionInfo: TaskCommandLogsTailQueryResponse['task']['executionInfo'];
}

function TaskCommandRealTimeLogs(props: RealTimeLogsProps) {
  let realTimeLogs = !isTaskCommandFinalStatus(props.command.status);
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
  }, [realTimeLogs, props.taskId, props.command.name, additionalLogs]);

  let { classes, taskId, command, initialLogLines, executionInfo } = props;

  let inProgress = !isTaskCommandFinalStatus(command.status);
  let downloadButton = (
    <div className={classes.actionButtons}>
      <Fab
        variant="circular"
        className={classes.downloadButton}
        href={command.type === 'UPLOAD_CACHE' ? cacheURL(taskId, executionInfo) : logURL(taskId, command)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Tooltip title={command.type === 'UPLOAD_CACHE' ? 'Download Cache' : 'Download Full Logs'}>
          <GetApp />
        </Tooltip>
      </Fab>
    </div>
  );
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {inProgress ? null : downloadButton}
      <Logs logsName={command.name} logs={initialLogLines.join('\n') + additionalLogs} />
      {inProgress ? <CirrusLinearProgress /> : null}
    </div>
  );
}

interface TaskCommandLogsProps extends WithStyles<typeof styles> {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
    type: TaskCommandType;
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
            executionInfo {
              cacheRetrievalAttempts {
                hits {
                  key
                  valid
                }
              }
            }
          }
        }
      `}
      render={response => {
        if (!response.props) {
          return (
            <div style={{ width: '100%', minHeight: 100, justifyContent: 'center' }}>
              <CirrusCircularProgress />
            </div>
          );
        }
        return (
          <TaskCommandRealTimeLogs
            initialLogLines={response.props.task.commandLogsTail || []}
            executionInfo={response.props.task.executionInfo}
            {...props}
          />
        );
      }}
    />
  );
}

export default withStyles(styles)(TaskCommandLogs);
