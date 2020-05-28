import React from 'react';
import AnsiUp from 'ansi_up';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import * as queryString from 'query-string';
import { UnregisterCallback } from 'history';

let ansiFormatter = new (AnsiUp as any)();
ansiFormatter.use_classes = true;

let styles = theme =>
  createStyles({
    logContainer: {
      overflowY: 'hidden',
      minHeight: '70px',
      height: '100%',
      maxWidth: '100%',
      background: theme.palette.primary.dark,
      padding: 8,
    },
    logLine: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      margin: 0,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        background: theme.palette.secondary.dark,
      },
      '&:focus': {
        outline: 0,
      },
    },
    logLineHighlighted: {
      background: theme.palette.secondary.dark,
    },
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  commandName: string;
  logs: string;
  taskId: string;
}

interface State {
  highLightedLineStart: number;
  highLightedLineEnd: number;
}

class Logs extends React.Component<Props, State> {
  unlisten: UnregisterCallback;

  constructor(props) {
    super(props);
    window.onhashchange = this.updateLinesSelection;
    window.onpopstate = this.updateLinesSelection;
    this.state = {
      highLightedLineStart: NaN,
      highLightedLineEnd: NaN,
    };
  }

  componentDidMount() {
    this.updateLinesSelection();
    this.unlisten = this.props.history.listen((location, action) => {
      this.updateLinesSelection();
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  updateLinesSelection() {
    let hash = window.location.hash;
    if (hash && queryString.parse(this.props.location.search).command === this.props.commandName) {
      let [startLine, endLine] = hash.replace('#', '').split('-');
      if (!endLine) {
        endLine = startLine;
      }

      this.setState(prevState => ({
        ...prevState,
        highLightedLineStart: parseInt(startLine.replace('L', ''), 10),
        highLightedLineEnd: parseInt(endLine.replace('L', ''), 10),
      }));
      document.getElementById(startLine).focus();
    }
  }

  render() {
    let { classes } = this.props;
    return (
      <div className={classes.logContainer}>
        {this.props.logs.split('\n').map((line, index) => (
          <div
            id={'L' + index}
            tabIndex={0} // to make it focusable
            key={index}
            className={classNames('log-line', classes.logLine, {
              [classes.logLineHighlighted]:
                this.state.highLightedLineStart <= index && index <= this.state.highLightedLineEnd,
            })}
            onClick={e => this.selectLine(e, index)}
            dangerouslySetInnerHTML={{ __html: ansiFormatter.ansi_to_html(line) }}
          />
        ))}
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

export default withStyles(styles)(withRouter(Logs));
