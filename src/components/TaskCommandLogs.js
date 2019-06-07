import React from 'react';
import Logs from "./logs/Logs";
import {QueryRenderer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import environment from "../createRelayEnvironment";
import CirrusLinearProgress from "./CirrusLinearProgress";
import {subscribeTaskCommandLogs} from "../rtu/ConnectionManager";
import CirrusCircularProgress from "./CirrusCircularProgress";
import {isTaskCommandFinalStatus} from "../utils/status";
import {Tooltip, withStyles} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

function logURL(taskId, command) {
  return "https://api.cirrus-ci.com/v1/task/" + taskId + "/logs/" + command.name + ".log";
}

function isCommandRunning(command) {
  return command.status === 'EXECUTING'
}

let styles = theme => ({
  actionButtons: {
    position: 'absolute',
    right: 0,
  },
  downloadButton: {
    margin: theme.spacing.unit
  },
});

class TaskCommandRealTimeLogs extends React.Component {
  constructor() {
    super();
    this.subscriptionClosable = null;
    this.logs = null;
  }

  componentDidMount() {
    this.subscriptionClosable = subscribeTaskCommandLogs(this.props.taskId, this.props.command.name, (newLogs) => {
      if (this.logs && newLogs !== "") {
        this.logs.appendLogs(newLogs)
      }
    })
  }

  componentWillUnmount() {
    if (this.subscriptionClosable) {
      this.subscriptionClosable()
    }
  }

  render() {
    let inProgress = !isTaskCommandFinalStatus(this.props.command.status);
    return (
      <div style={{width: "100%", height: "100%"}}>
        <Logs ref={(component) => {
          this.logs = component;
        }}/>
        {inProgress ? <CirrusLinearProgress/> : null}
      </div>
    );
  }
}

class TaskCommandFileLogs extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {taskId, classes} = this.props;
    let command = this.props.command;
    return (
      <div style={{width: "100%", height: "100%"}}>
        <div className={classes.actionButtons}>
          <Fab variant="contained"
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
        <TaskCommandLogsTail taskId={taskId}
                             commandName={command.name}/>
      </div>
    );
  }
}

const TaskCommandLogsTail = (loadingProps) => (
  <QueryRenderer
    environment={environment}
    variables={loadingProps}
    query={
      graphql`
        query TaskCommandLogsTailQuery($taskId: ID!, $commandName: String!) {
          task(id: $taskId) {
            commandLogsTail(name: $commandName)
          }
        }
      `
    }

    render={({error, props}) => {
      if (!props) {
        return (
          <div style={{width: "100%", minHeight: 100}}>
            <div className="text-center">
              <CirrusCircularProgress/>
            </div>
          </div>
        );
      }
      return <Logs logLines={props.task.commandLogsTail} {...loadingProps}/>
    }}
  />
);

class TaskCommandLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initiallyRealTime: !isTaskCommandFinalStatus(props.command.status)
    };
  }

  render() {
    if (isTaskCommandFinalStatus(this.props.command.status) && !this.state.initiallyRealTime) {
      // if we were initially following logs in real time there is no need to show logs from file
      return <TaskCommandFileLogs {...this.props}/>
    }
    if (isCommandRunning(this.props.command) || this.state.initiallyRealTime) {
      return <TaskCommandRealTimeLogs {...this.props}/>
    }
    return null
  }
}

export default withRouter(withStyles(styles)(TaskCommandLogs))
