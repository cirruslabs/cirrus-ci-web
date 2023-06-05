import React, { useEffect, useState } from 'react';
import Logs from '../logs/Logs';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import { subscribeTaskCommandLogs } from '../../rtu/ConnectionManager';
import { isTaskCommandFinalStatus } from '../../utils/status';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Fab from '@mui/material/Fab';
import {
  TaskCommandLogsTailQuery,
  TaskCommandLogsTailQuery$data,
} from './__generated__/TaskCommandLogsTailQuery.graphql';
import { TaskCommandStatus, TaskCommandType } from './__generated__/TaskCommandList_task.graphql';

function logURL(taskId: string, command) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/logs/' + command.name + '.log';
}

function cacheURL(taskId: string, cacheHit) {
  return 'https://api.cirrus-ci.com/v1/task/' + taskId + '/caches/' + cacheHit.key + '.tar.gz';
}

const useStyles = makeStyles(theme => {
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
  executionInfo: TaskCommandLogsTailQuery$data['task']['executionInfo'];
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

  let { taskId, command, initialLogLines, executionInfo } = props;
  let classes = useStyles();

  let inProgress = !isTaskCommandFinalStatus(command.status);

  let cacheHit;
  if (command.type === 'CACHE' && executionInfo) {
    cacheHit = executionInfo.cacheRetrievalAttempts.hits.find(hit => hit.key.startsWith(`${command.name}-`));
  }

  let downloadButton = (
    <div className={classes.actionButtons}>
      {cacheHit && (
        <Tooltip title="Download Cache" disableInteractive>
          <Fab
            variant="circular"
            className={classes.downloadButton}
            href={cacheURL(taskId, cacheHit)}
            rel="noopener noreferrer"
            size="small"
          >
            <ArchiveOutlinedIcon />
          </Fab>
        </Tooltip>
      )}
      <Tooltip title="Open Full Logs" disableInteractive>
        <Fab
          variant="circular"
          className={classes.openButton}
          href={logURL(taskId, command)}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <OpenInNewOutlinedIcon fontSize="inherit" />
        </Fab>
      </Tooltip>
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

interface TaskCommandLogsProps {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
    type: TaskCommandType;
  };
}

export default function TaskCommandLogs(props: TaskCommandLogsProps) {
  const response = useLazyLoadQuery<TaskCommandLogsTailQuery>(
    graphql`
      query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
        task(id: $taskId) {
          commandLogsTail(name: $commandName)
          executionInfo {
            cacheRetrievalAttempts {
              hits {
                key
              }
            }
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
