import React from 'react';
import AnsiUp from 'ansi_up';
import {cirrusColors} from "../../cirrusTheme";

import './logs.css'

let ansiFormatter = new AnsiUp();
ansiFormatter.use_classes = true;

class Logs extends React.Component {
  constructor(props) {
    super(props);
    let logLines = this.props.logLines || [];
    this.state = {logs: logLines.join("\n")};
  }

  static buildLogLine(line, index, style) {
    return (
      <div key={index} style={style} className="log-line"
           dangerouslySetInnerHTML={{__html: ansiFormatter.ansi_to_html(line)}}/>
    )
  }

  appendLogs(newLogs) {
    this.setState({logs: this.state.logs + newLogs});
  }

  render() {
    let styles = {
      logContainer: {
        overflowY: "scroll",
        minHeight: "50px",
        height: "100%",
        maxWidth: "100%",
        background: cirrusColors.cirrusDark,
        padding: 8,
      },
      logLine: {
        width: "100%",
        display: 'flex',
        flexWrap: 'wrap',
        margin: 0,
        color: cirrusColors.cirrusWhite,
      },
    };

    return (
      <div style={styles.logContainer}>
        {this.state.logs.split("\n").map((line, index) => Logs.buildLogLine(line, index, styles.logLine))}
      </div>
    );
  }
}

export default Logs
