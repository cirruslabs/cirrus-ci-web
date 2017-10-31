import React from 'react';
import {FloatingActionButton, FontIcon} from "material-ui";
import {subscribe, taskCommandLogTopic} from "../rtu/ConnectionManager";


class TaskCommandLogs extends React.Component {
  constructor() {
    super();
    this.subscriptionClosable = null;
    this.state = {logLines: [], logTail: ""};
  }

  componentDidMount() {
    let logTopic = taskCommandLogTopic(this.props.taskId, this.props.command.name);
    this.subscriptionClosable = subscribe(logTopic, (newLogs) => {
      let currentLogsToAppend = this.state.logTail + newLogs;
      let newLogLines = currentLogsToAppend.split("\n");
      let newLogTail = newLogLines.pop();
      this.setState({
        logLines: this.state.logLines.concat(newLogLines),
        logTail: newLogTail
      })
    })
  }

  componentWillUnmount() {
    if (this.subscriptionClosable) {
      this.subscriptionClosable()
    }
  }

  render() {
    let command = this.props.command;
    let logLines = this.state.logLines;
    return (
      <div>
        <div>
          {
            logLines.map((line, index) => <p key={index}>{line}</p>)
          }
          <p>{this.state.logTail}</p>
        </div>
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
