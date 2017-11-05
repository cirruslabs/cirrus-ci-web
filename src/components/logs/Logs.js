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
    let styles = {
      logContainer: {
        overflowY: "scroll",
        backgroundColor: "#212121",
        minHeight: "50px",
        maxHeight: "500px",
      },
      logLine: {
        color: "#FAFAFA",
        fontFamily: "Monaco,monospace",
        fontSize: "12px",
        lineHeight: "19px",
        paddingLeft: "7px",
      },
    };

    let logLines = this.state.logLines;
    return (
      <div style={styles.logContainer}>
        {
          logLines.map((line, index) => <p key={index} style={styles.logLine}>{line}</p>)
        }
        <p>{this.state.logTail}</p>
      </div>
    );
  }
}

export default Logs
