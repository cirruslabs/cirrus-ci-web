import React from 'react';
import {FontIcon, RaisedButton} from "material-ui";
import {subscribe, taskCommandLogTopic} from "../rtu/ConnectionManager";
import Logs from "./logs/Logs";
import {graphql, QueryRenderer} from "react-relay";
import environment from "../createRelayEnvironment";
import CirrusLinearProgress from "./CirrusLinearProgress";

function logURL(taskId, command) {
  return "http://api.cirrus-ci.org/v1/task/" + taskId + "/logs/" + command.name + ".log";
}

class TaskCommandRealTimeLogs extends React.Component {
  constructor() {
    super();
    this.subscriptionClosable = null;
    this.logs = <Logs/>;
  }

  componentDidMount() {
    let logTopic = taskCommandLogTopic(this.props.taskId, this.props.command.name);
    this.subscriptionClosable = subscribe(logTopic, (newLogs) => {
      this.logs.appendLogs(newLogs)
    })
  }

  componentWillUnmount() {
    if (this.subscriptionClosable) {
      this.subscriptionClosable()
    }
  }

  render() {
    return this.logs;
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

export default function (props) {
  let command = props.command;
  if (command.status === 'SUCCESS' || command.status === 'FAILURE') {
    return <TaskCommandFileLogs {...props}/>
  } else {
    return <TaskCommandRealTimeLogs {...props}/>
  }
}
