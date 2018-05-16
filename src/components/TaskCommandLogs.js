import React from 'react';
import Logs from "./logs/Logs";
import {graphql, QueryRenderer} from "react-relay";
import environment from "../createRelayEnvironment";
import CirrusLinearProgress from "./CirrusLinearProgress";
import {subscribeTaskCommandLogs} from "../rtu/ConnectionManager";
import CirrusCircularProgress from "./CirrusCircularProgress";
import {isTaskCommandFinalStatus} from "../utils/status";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

function logURL(taskId, command) {
  return "https://api.cirrus-ci.com/v1/task/" + taskId + "/logs/" + command.name + ".log";
}

function isCommandRunning(command) {
  return command.status === 'EXECUTING'
}

let styles = {
  downloadButton: {
    margin: 8
  },
};

class TaskCommandRealTimeLogs extends React.Component {
  constructor() {
    super();
    this.subscriptionClosable = null;
    this.logs = null;
  }

  componentDidMount() {
    this.subscriptionClosable = subscribeTaskCommandLogs(this.props.taskId, this.props.command.name, (newLogs) => {
      if (this.logs) {
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

const TaskCommandFileLogs = (props) => {
  let {classes} = props;
  let command = props.command;
  return (
    <div style={{width: "100%", height: "100%"}}>
      <TaskCommandLogsTail taskId={props.taskId} commandName={command.name}/>
      <Button variant="raised"
              className={classes.downloadButton}
              href={logURL(props.taskId, command)}
              target="_blank"
              rel="noopener noreferrer"
      >
        <Icon>get_app</Icon>
        Download Full Logs
      </Button>
    </div>
  );
};

const TaskCommandLogsTail = (props) => (
  <QueryRenderer
    environment={environment}
    variables={props}
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
          <div style={{width: "100%"}}>
            <div className="text-center">
              <CirrusCircularProgress/>
            </div>
          </div>
        );
      }
      return <Logs logLines={props.task.commandLogsTail}/>
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

export default withStyles(styles)(TaskCommandLogs)
