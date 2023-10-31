import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AnsiUp from 'ansi_up';
import classNames from 'classnames';
import queryString from 'query-string';

import { makeStyles } from '@mui/styles';

let ansiFormatter = new (AnsiUp as any)();
ansiFormatter.use_classes = true;

const useStyles = makeStyles(theme => {
  return {
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
  };
});

interface Props {
  logsName: string;
  logs: string;
  stripTimestamps?: boolean;
}

function Logs(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  let highLightedLineStart = NaN;
  let highLightedLineEnd = NaN;

  let search = queryString.parse(location.search);

  if (search.logs === props.logsName || search.command === props.logsName) {
    let [startLine, endLine] = location.hash.replace('#', '').split('-');
    if (!endLine) {
      endLine = startLine;
    }

    highLightedLineStart = parseInt(startLine.replace('L', ''), 10);
    highLightedLineEnd = parseInt(endLine.replace('L', ''), 10);
    let elementToFocus = document.getElementById(startLine);
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }

  function selectLine(event, lineNumber) {
    let lineRange = `L${lineNumber}`;
    if (event.shiftKey) {
      lineRange = `L${highLightedLineStart}-L${lineNumber}`;
    }
    navigate({
      search: `?logs=${props.logsName}`,
      hash: `#${lineRange}`,
    });
  }

  let classes = useStyles();
  return (
    <div className={classes.logContainer}>
      {props.logs.split('\n').map((line, index) => {
        // Cirrus CI Agent uses exactly 15 characters for the timestamps[1]
        // and they all start with a "[" prefix.
        //
        // [1]: https://github.com/cirruslabs/cirrus-ci-agent/blob/a4bc09e4e8c8190158f5859854995d13fba3d335/internal/executor/logs.go#L85
        if (props.stripTimestamps && line.startsWith("[")) {
          line = line.slice(15);
        }

        return (
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
        );
      })}
    </div>
  );
}

export default Logs;
