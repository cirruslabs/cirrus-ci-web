import React from 'react';
import Logs from './logs/Logs';
import { QueryRenderer, fetchQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../createRelayEnvironment';
import CirrusLinearProgress from './CirrusLinearProgress';
import { subscribeTaskCommandLogs } from '../rtu/ConnectionManager';
import CirrusCircularProgress from './CirrusCircularProgress';
import { isTaskCommandFinalStatus, isTaskFinalStatus } from '../utils/status';
import { Tooltip, withStyles, WithStyles, createStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TaskCommandLogsTailQuery } from './__generated__/TaskCommandLogsTailQuery.graphql';
import { TaskCommandStatus } from './__generated__/TaskCommandList_task.graphql';

function logURL(taskId, command) {
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

interface RealTimeLogsState {
  streamedLogLines: string;
}

enum RealTimeMode {
  SUBSCRIPTION = 'subscription',
  POLLING = 'polling',
}

// TODO: Once subscription / websocket based updates work reliably, we can and should remove the polling based implementation
const CURRENT_REALTIME_MODE = RealTimeMode.POLLING;
const AUTO_REFRESH_POLLING_INTERVAL_MS = 2000;

const taskCommandLogsTailQuery = graphql`
  query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
    task(id: $taskId) {
      commandLogsTail(name: $commandName)
    }
  }
`;

class TaskCommandRealTimeLogs extends React.Component<RealTimeLogsProps, RealTimeLogsState> {
  subscriptionClosable?: ReturnType<typeof subscribeTaskCommandLogs> | null = null;

  constructor(props: RealTimeLogsProps) {
    super(props);
    this.state = {
      streamedLogLines: '\n',
    };
  }

  private shouldStreamLogs(props: RealTimeLogsProps) {
    return !isTaskFinalStatus(props.command.status);
  }

  componentDidMount() {
    if (this.shouldStreamLogs(this.props)) {
      this.subscribeRealtimeLogs();
    }
  }

  componentDidUpdate(prevProps: RealTimeLogsProps) {
    if (!this.shouldStreamLogs(prevProps) && this.shouldStreamLogs(this.props)) {
      this.subscribeRealtimeLogs();
    } else if (this.shouldStreamLogs(prevProps) && !this.shouldStreamLogs(this.props)) {
      this.unsubscribeRealtimeLogs();
    }
  }

  subscribeRealtimeLogs() {
    if (CURRENT_REALTIME_MODE === RealTimeMode.POLLING) {
      const interval = setInterval(() => {
        fetchQuery<TaskCommandLogsTailQuery>(environment, taskCommandLogsTailQuery, {
          taskId: this.props.taskId,
          commandName: this.props.command.name,
        });
      }, AUTO_REFRESH_POLLING_INTERVAL_MS);
      this.subscriptionClosable = () => clearInterval(interval);
    } else if (CURRENT_REALTIME_MODE === RealTimeMode.SUBSCRIPTION) {
      this.subscriptionClosable = subscribeTaskCommandLogs(this.props.taskId, this.props.command.name, newLogs => {
        this.setState(prevState => ({
          ...prevState,
          streamedLogLines: prevState.streamedLogLines + newLogs,
        }));
      });
    }
  }

  unsubscribeRealtimeLogs() {
    if (this.subscriptionClosable) {
      this.subscriptionClosable();
    }
  }

  componentWillUnmount() {
    this.unsubscribeRealtimeLogs();
  }

  render() {
    let { classes, taskId, command, initialLogLines } = this.props;
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
            <Icon>get_app</Icon>
          </Tooltip>
        </Fab>
      </div>
    );
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {inProgress ? null : downloadButton}
        <Logs
          taskId={taskId}
          commandName={command.name}
          logs={initialLogLines.join('\n') + this.state.streamedLogLines}
        />
        {inProgress ? <CirrusLinearProgress /> : null}
      </div>
    );
  }
}

interface TaskCommandLogsProps extends RouteComponentProps, WithStyles<typeof styles> {
  taskId: string;
  command: {
    name: string;
    status: TaskCommandStatus;
  };
}

class TaskCommandLogs extends React.Component<TaskCommandLogsProps> {
  render() {
    return (
      <QueryRenderer<TaskCommandLogsTailQuery>
        environment={environment}
        variables={{ taskId: this.props.taskId, commandName: this.props.command.name }}
        query={taskCommandLogsTailQuery}
        render={({ error, props }) => {
          if (!props) {
            return (
              <div style={{ width: '100%', minHeight: 100 }}>
                <div className="text-center">
                  <CirrusCircularProgress />
                </div>
              </div>
            );
          }
          return <TaskCommandRealTimeLogs initialLogLines={props.task.commandLogsTail || []} {...this.props} />;
        }}
      />
    );
  }
}

export default withRouter(withStyles(styles)(TaskCommandLogs));
