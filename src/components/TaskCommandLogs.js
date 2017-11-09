import React from 'react';
import {FontIcon, RaisedButton} from "material-ui";
import Logs from "./logs/Logs";
import {graphql, QueryRenderer} from "react-relay";
import environment from "../createRelayEnvironment";
import CirrusLinearProgress from "./CirrusLinearProgress";
import {subscribeTaskCommandLogs} from "../rtu/ConnectionManager";

function logURL(taskId, command) {
  return "http://api.cirrus-ci.org/v1/task/" + taskId + "/logs/" + command.name + ".log";
}

function hasCommandFinished(command) {
  return command.status === 'SUCCESS' || command.status === 'FAILURE'
}

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
    let inProgress = !hasCommandFinished(this.props.command);
    return (
      <div>
        <Logs ref={(component) => { this.logs = component; }} />
        {inProgress ? <CirrusLinearProgress/> : null}
      </div>
    );
  }
}

const TaskCommandFileLogs = (props) => {
  let styles = {
    gap: {
      paddingTop: 16
    },
  };
  let command = props.command;
  return (
    <div>
      <TaskCommandLogsTail taskId={props.taskId} commandName={command.name}/>
      <div style={styles.gap}/>
      <RaisedButton
        href={logURL(props.taskId, command)}
        target="_blank"
        label="Download Full Logs"
        icon={<FontIcon className="material-icons">get_app</FontIcon>}
      />
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
        return <CirrusLinearProgress/>
      }
      return <Logs logLines={props.task.commandLogsTail}/>
    }}
  />
);

class TaskCommandLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initiallyRealTime: !hasCommandFinished(props.command)
    };
  }

  render() {
    if (hasCommandFinished(this.props.command) && !this.state.initiallyRealTime) {
      // if we were initially following logs in real time there is no need to show logs from file
      return <TaskCommandFileLogs {...this.props}/>
    } else {
      return <TaskCommandRealTimeLogs {...this.props}/>
    }
  }
}

export default TaskCommandLogs
