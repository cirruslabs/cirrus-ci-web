import React from 'react';

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.subscriptionClosable = null;
    this.state = {
      logLines: props.logLines || [],
      logTail: ""
    };
  }

  appendLogs(newLogs) {
    let currentLogsToAppend = this.state.logTail + newLogs;
    let newLogLines = currentLogsToAppend.split("\n");
    let newLogTail = newLogLines.pop();
    this.setState({
      logLines: this.state.logLines.concat(newLogLines),
      logTail: newLogTail
    })
  }

  render() {
    let logLines = this.state.logLines;
    return (
      <div>
        {
          logLines.map((line, index) => <p key={index}>{line}</p>)
        }
        <p>{this.state.logTail}</p>
      </div>
    );
  }
}

export default Logs
