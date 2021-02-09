import React, { useEffect, useState } from 'react';
import AnsiUp from 'ansi_up';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';
import * as queryString from 'query-string';

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
      '&:empty': {
        height: theme.typography.fontSize,
      },
    },
    logLineHighlighted: {
      background: theme.palette.secondary.dark,
    },
  });

interface Props extends WithStyles<typeof styles> {
  commandName: string;
  logs: string;
  taskId: string;
}

function Logs(props: Props) {
  const history = useHistory();
  let location = useLocation();
  let [highLightedLineStart, setHighLightedLineStart] = useState(NaN);
  let [highLightedLineEnd, setHighLightedLineEnd] = useState(NaN);

  useEffect(() => {
    updateLinesSelection();
    return history.listen(location => {
      updateLinesSelection();
    });
  }, [history]);

  function updateLinesSelection() {
    let hash = window.location.hash;
    if (hash && queryString.parse(location.search).command === props.commandName) {
      let [startLine, endLine] = hash.replace('#', '').split('-');
      if (!endLine) {
        endLine = startLine;
      }

      setHighLightedLineStart(parseInt(startLine.replace('L', ''), 10));
      setHighLightedLineEnd(parseInt(endLine.replace('L', ''), 10));
      let elementToFocus = document.getElementById(startLine);
      if (elementToFocus) {
        elementToFocus.focus();
      }
    }
  }

  function selectLine(event, lineNumber) {
    let lineRange = `L${lineNumber}`;
    if (event.shiftKey) {
      lineRange = `L${highLightedLineStart}-L${lineNumber}`;
    }
    history.push(`/task/${props.taskId}?command=${props.commandName}#${lineRange}`);
  }

  let { classes } = props;
  return (
    <div className={classes.logContainer}>
      {props.logs.split('\n').map((line, index) => (
        <div
          id={'L' + index}
          tabIndex={0} // to make it focusable
          key={index}
          className={classNames('log-line', classes.logLine, {
            [classes.logLineHighlighted]: highLightedLineStart <= index && index <= highLightedLineEnd,
          })}
          onClick={e => selectLine(e, index)}
          dangerouslySetInnerHTML={{ __html: ansiFormatter.ansi_to_html(line) }}
        />
      ))}
    </div>
  );
}

export default withStyles(styles)(Logs);
