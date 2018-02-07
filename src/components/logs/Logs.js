import React from 'react';
import {Terminal} from 'xterm';
import 'xterm/dist/xterm.css';
import * as fit from 'xterm/lib/addons/fit/fit';

class Logs extends React.Component {
  constructor(props) {
    super(props);
    Terminal.applyAddon(fit);
    this.term = new Terminal({
      cursorBlink: false,
      cols: 200,
      disableStdin: true,
      fontFamily: "Monaco,monospace",
      fontSize: 12,
    });
    this.term.on('open', () => {
      this.term.fit();
    })
  }

  appendLogs(newLogs) {
    // for some weird reasons just this.term.write(newLogs) doesn't work as intendent
    let logLines = newLogs.split("\n");
    if (logLines.length === 0) {
      return;
    }
    this.term.write(logLines.shift());
    if (logLines.length === 0) {
      return;
    }
    let tail = logLines.pop();
    logLines.forEach((line) => this.term.writeln(line))
    this.term.write(tail)
  }

  componentDidMount() {
    this.term.open(this.refs.container);
    if (this.props.logLines) {
      this.props.logLines.forEach((line) => this.term.writeln(line));
    }
  }

  componentWillUnmount() {
    this.term.destroy()
  }

  render() {
    let styles = {
      logContainer: {
        overflowY: "scroll",
        minHeight: "50px",
        maxHeight: "500px",
      },
    };

    return (
      <div style={styles.logContainer} ref="container"/>
    );
  }
}

export default Logs
