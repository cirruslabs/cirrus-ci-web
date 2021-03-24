import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

const styles = (theme: Theme) =>
  createStyles({
    configurationTable: {
      color: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      background: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      width: '100%',
      borderSpacing: '0px',
    },
    lineNumber: {
      // An attempt to be consistent in colors with chips[1] backgrounds used on the same builds page
      //
      // [1]: https://github.com/mui-org/material-ui/blob/bda3d8541b2f3bea14ed241ae8155239d524a24c/packages/material-ui/src/Chip/Chip.js#L14
      background: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
      fontFamily: 'Monaco, monospace',
      paddingRight: '5px',
      width: '1%',
      minWidth: '40px',
      textAlign: 'right',
    },
    lineContent: {
      fontFamily: 'Monaco, monospace',
      paddingLeft: '5px',
      whiteSpace: 'pre-wrap',
    },
    issue: {
      fontSize: theme.typography.fontSize,
    },
  });

interface Issue {
  level: string;
  message: string;
  line: number;
  column: number;
}

interface Props extends WithStyles<typeof styles> {
  configuration: string;
  issues: ReadonlyArray<Issue>;
}

function ConfigurationWithIssues(props: Props) {
  let { configuration, issues, classes } = props;

  // Sort issues by (line, column) and store them in a map for faster access
  var sortedIssues = issues.slice().sort(function (left, right) {
    return left.line - right.line || left.column - right.column;
  });

  let issueMap = {};

  for (let issue of sortedIssues) {
    let targetList = issueMap[issue.line] || (issueMap[issue.line] = []);
    targetList.push(issue);
  }

  // Render configuration with issues
  function getIssuesForLine(lineNumber: number) {
    const issuesForLine = issueMap[lineNumber];

    if (issuesForLine == undefined || issuesForLine.length == 0) return null;

    const renderedIssues = issuesForLine.map(issue => {
      return (
        <Alert className={classes.issue} severity={issue.level.toLowerCase()}>
          {issue.message}
        </Alert>
      );
    });

    return (
      <tr>
        <td colSpan={2}>{renderedIssues}</td>
      </tr>
    );
  }

  const lines = configuration.split('\n').map((lineContent, zeroBasedLineNumber) => [
    <tr>
      <td className={classes.lineNumber}>{zeroBasedLineNumber + 1}</td>
      <td className={classes.lineContent}>
        <span>{lineContent}</span>
      </td>
    </tr>,
    getIssuesForLine(zeroBasedLineNumber + 1),
  ]);

  return (
    <table className={classes.configurationTable}>
      <tbody>{lines}</tbody>
    </table>
  );
}

export default withStyles(styles)(ConfigurationWithIssues);
