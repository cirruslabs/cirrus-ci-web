import React from 'react';
import { createStyles, Theme } from '@material-ui/core';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { ConfigurationWithIssues_build } from './__generated__/ConfigurationWithIssues_build.graphql';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const styles = (theme: Theme) =>
  createStyles({
    configurationTable: {
      color: theme.palette.type === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      background: theme.palette.type === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      width: '100%',
      borderSpacing: '0',
    },
    lineNumber: {
      // An attempt to be consistent in colors with chips[1] backgrounds used on the same builds page
      //
      // [1]: https://github.com/mui-org/material-ui/blob/bda3d8541b2f3bea14ed241ae8155239d524a24c/packages/material-ui/src/Chip/Chip.js#L14
      background: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
      fontFamily: 'Monaco, monospace',
      paddingRight: theme.spacing(1),
      width: '1%',
      minWidth: theme.spacing(5),
      textAlign: 'right',
    },
    lineContent: {
      fontFamily: 'Monaco, monospace',
      paddingLeft: theme.spacing(1),
      whiteSpace: 'pre-wrap',
    },
    issue: {
      fontSize: theme.typography.fontSize,
      borderRadius: '0',
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: ConfigurationWithIssues_build;
}

function ConfigurationWithIssues(props: Props) {
  let { build, classes } = props;

  if (!build.parsingResult || build.parsingResult.issues.length === 0) {
    return null;
  }

  // Sort issues by (line, column) and store them in a map for faster access
  var sortedIssues = build.parsingResult.issues
    .filter(issue => {
      return issue.path.endsWith('.cirrus.yml') || issue.path.endsWith('.cirrus.yaml');
    })
    .sort(function (left, right) {
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

    if (issuesForLine === undefined || issuesForLine.length === 0) return null;

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

  const lines = build.parsingResult.processedYamlConfig.split('\n').map((lineContent, zeroBasedLineNumber) => [
    <tr>
      <td className={classes.lineNumber}>{zeroBasedLineNumber + 1}</td>
      <td className={classes.lineContent}>
        <span>{lineContent}</span>
      </td>
    </tr>,
    getIssuesForLine(zeroBasedLineNumber + 1),
  ]);

  const errorIssue = build.parsingResult.issues.find(it => it.level === 'ERROR');
  const summaryText = errorIssue ? 'Failed to parse configuration' : 'Issues found while parsing configuration';

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{summaryText}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table className={classes.configurationTable} cellPadding={0}>
          <tbody>{lines}</tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}

export default createFragmentContainer(withStyles(styles)(ConfigurationWithIssues), {
  build: graphql`
    fragment ConfigurationWithIssues_build on Build {
      parsingResult {
        processedYamlConfig
        issues {
          level
          message
          path
          line
          column
        }
      }
    }
  `,
});
