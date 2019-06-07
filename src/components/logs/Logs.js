import React from 'react';
import AnsiUp from 'ansi_up';
import {cirrusColors} from "../../cirrusTheme";

import './logs.css'
import {withRouter} from "react-router-dom";
import classNames from 'classnames'
import {withStyles} from "@material-ui/styles";
import * as queryString from "query-string";

let ansiFormatter = new AnsiUp();
ansiFormatter.use_classes = true;

let styles = theme => ({
  logContainer: {
    overflowY: "hidden",
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
    '&:hover': {
      background: cirrusColors.cirrusLightDark,
    }
  },
  logLineHighlighted: {
    background: cirrusColors.cirrusLightDark,
  },
});

class Logs extends React.Component {
  constructor(props) {
    super(props);
    let logLines = this.props.logLines || [];
    window.onhashchange = this.updateLinesSelection;
    window.onpopstate = this.updateLinesSelection;
    this.state = {
      logs: logLines.join("\n"),
      highLightedLineStart: NaN,
      highLightedLineEnd: NaN
    };
  }

  componentDidMount(): void {
    this.updateLinesSelection();
    this.unlisten = this.props.history.listen((location, action) => {
      this.updateLinesSelection();
    });
  }


  componentWillUnmount(): void {
    this.unlisten();
  }

  updateLinesSelection() {
    let hash = window.location.hash;
    if (hash && queryString.parse(this.props.location.search).command === this.props.commandName) {
      let [startLine, endLine] = hash.replace("#", "").split("-");
      if (!endLine) {
        endLine = startLine;
      }

      this.setState(prevState => ({
        ...prevState,
        highLightedLineStart: parseInt(startLine.replace("L", ""), 10),
        highLightedLineEnd: parseInt(endLine.replace("L", ""), 10)
      }));
    }
  }

  appendLogs(newLogs) {
    this.setState({logs: this.state.logs + newLogs});
  }

  render() {
    let {classes} = this.props;
    return (
      <div className={classes.logContainer}>
        {this.state.logs.split("\n").map((line, index) =>
          <div id={"L" + index}
               key={index}
               className={
                 classNames(
                   "log-line",
                   classes.logLine,
                   {
                     [classes.logLineHighlighted]: (this.state.highLightedLineStart <= index && index <= this.state.highLightedLineEnd)
                   }
                 )
               }
               onClick={(e) => this.selectLine(e, index)}
               dangerouslySetInnerHTML={{__html: ansiFormatter.ansi_to_html(line)}}/>
        )}
      </div>
    );
  }

  selectLine(event, lineNumber) {
    let lineRange = `L${lineNumber}`;
    if (event.shiftKey) {
      lineRange = `L${this.state.highLightedLineStart}-L${lineNumber}`;
    }
    this.props.history.push(`/task/${this.props.taskId}?command=${this.props.commandName}#${lineRange}`);
    this.forceUpdate();
  }
}

export default withRouter(withStyles(styles)(Logs))
