import React, { useEffect, useState } from 'react';
import { useLazyLoadQuery, useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import CirrusLinearProgress from 'components/common/CirrusLinearProgress';
import Logs from 'components/logs/Logs';
import { subscribeTaskCommandLogs } from 'rtu/ConnectionManager';
import { isTaskCommandFinalStatus } from 'utils/status';

import { TaskCommandStatus, TaskCommandType } from './__generated__/TaskCommandList_task.graphql';
import { TaskCommandLogsTailQuery } from './__generated__/TaskCommandLogsTailQuery.graphql';
import { TaskCommandLogs_executionInfo$key } from './__generated__/TaskCommandLogs_executionInfo.graphql';

function logURL(taskId: string, command) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/logs/' + command.name + '.log';
}

function cacheURL(taskId: string, cacheHit) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/caches/' + cacheHit.key + '.tar.gz';
}

const useStyles = mui.makeStyles(theme => {
  return {
    actionButtons: {
      position: 'absolute',
      right: 0,
      paddingTop: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    downloadButton: {
      marginRight: theme.spacing(1.5),
    },
    openButton: {
      fontSize: 20,
    },
  };
});

interface RealTimeLogsProps {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
    type: TaskCommandType;
  };
  initialLogLines: ReadonlyArray<string>;
  executionInfo: TaskCommandLogs_executionInfo$key;
  stripTimestamps?: boolean;
}

function TaskCommandRealTimeLogs(props: RealTimeLogsProps) {
  const executionInfo = useFragment(
    graphql`
      fragment TaskCommandLogs_executionInfo on ExecutionInfo {
        cacheRetrievalAttempts {
          hits {
            key
          }
        }
      }
    `,
    props.executionInfo,
  );

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

  let { taskId, command, initialLogLines } = props;
  let classes = useStyles();

  let inProgress = !isTaskCommandFinalStatus(command.status);

  let cacheHit;
  if (command.type === 'CACHE' && executionInfo) {
    cacheHit = executionInfo.cacheRetrievalAttempts.hits.find(hit => hit.key.startsWith(`${command.name}-`));
  }

  let downloadButton = (
    <div className={classes.actionButtons}>
      {cacheHit && (
        <mui.Tooltip title="Download Cache" disableInteractive>
          <mui.Fab
            variant="circular"
            className={classes.downloadButton}
            href={cacheURL(taskId, cacheHit)}
            rel="noopener noreferrer"
            size="small"
          >
            <mui.icons.ArchiveOutlined />
          </mui.Fab>
        </mui.Tooltip>
      )}
      <mui.Tooltip title="Open Full Logs" disableInteractive>
        <mui.Fab
          variant="circular"
          className={classes.openButton}
          href={logURL(taskId, command)}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <mui.icons.OpenInNewOutlined fontSize="inherit" />
        </mui.Fab>
      </mui.Tooltip>
    </div>
  );
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {inProgress ? null : downloadButton}
      <Logs logsName={command.name} logs={initialLogLines.join('\n') + additionalLogs} stripTimestamps={props.stripTimestamps} />
      {inProgress ? <CirrusLinearProgress /> : null}
    </div>
  );
}

interface TaskCommandLogsProps {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
    type: TaskCommandType;
  };
  stripTimestamps?: boolean;
}

export default function TaskCommandLogs(props: TaskCommandLogsProps) {
  const response = useLazyLoadQuery<TaskCommandLogsTailQuery>(
    graphql`
      query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
        task(id: $taskId) {
          commandLogsTail(name: $commandName)
          executionInfo {
            ...TaskCommandLogs_executionInfo
          }
        }
      }
    `,
    { taskId: props.taskId, commandName: props.command.name },
  );

  if (!response.task) return null;

  return (
    <TaskCommandRealTimeLogs
      initialLogLines={response.task.commandLogsTail || []}
      executionInfo={response.task.executionInfo}
      {...props}
    />
  );
}
