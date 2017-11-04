import React from 'react';
import {FloatingActionButton, FontIcon} from "material-ui";
import {subscribe, taskCommandLogTopic} from "../rtu/ConnectionManager";
import Logs from "./logs/Logs";


class TaskCommandLogs extends React.Component {
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
    let command = this.props.command;
    return (
      <div>
        {this.logs}
        <FloatingActionButton mini={true}
                              href={this.logURL(command) }>
          <FontIcon className="material-icons">get_app</FontIcon>
        </FloatingActionButton>
      </div>
    );
  }

  logURL(command) {
    return "http://api.cirrus-ci.org/v1/task/" + this.props.taskId + "/logs/" + command.name + ".log";
  }
}

export default TaskCommandLogs
