import React, { ReactNode } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { ConfigurationWithIssues_build$key } from './__generated__/ConfigurationWithIssues_build.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    configurationTable: {
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
      width: '100%',
      borderSpacing: '0',
    },
    lineNumber: {
      // An attempt to be consistent in colors with chips[1] backgrounds used on the same builds page
      //
      // [1]: https://github.com/mui-org/material-ui/blob/bda3d8541b2f3bea14ed241ae8155239d524a24c/packages/material-ui/src/Chip/Chip.js#L14
      background: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
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
    columnFlexDirection: {
      flexDirection: 'column',
    },
    topPadded: {
      paddingTop: theme.spacing(2),
    },
  };
});

interface Props {
  build: ConfigurationWithIssues_build$key;
}

export default function ConfigurationWithIssues(props: Props) {
  let build = useFragment(
    graphql`
      fragment ConfigurationWithIssues_build on Build {
        parsingResult {
          rawStarlarkConfig
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
    props.build,
  );

  let classes = useStyles();

  if (!build.parsingResult || build.parsingResult.issues.length === 0) {
    return null;
  }

  // cacheIssues sorts issues by (line, column) and stores them in a map for faster access.
  function cacheIssues(issues: Array<any>): Map<number, any> {
    let issueMap = new Map();

    issues
      .sort(function (left, right) {
        return left.line - right.line || left.column - right.column;
      })
      .forEach(issue => {
        let targetList = issueMap.get(issue.line);

        if (targetList === undefined) {
          issueMap.set(issue.line, [issue]);
        } else {
          targetList.push(issue);
        }
      });

    return issueMap;
  }

  function getIssuesForLine(issueCache: Map<number, any>, lineNumber: number) {
    const issuesForLine = issueCache.get(lineNumber);

    if (issuesForLine === undefined || issuesForLine.length === 0) return null;

    const renderedIssues = issuesForLine.map(issue => (
      <mui.Alert className={classes.issue} severity={issue.level.toLowerCase()}>
        {issue.message}
      </mui.Alert>
    ));

    return (
      <tr>
        <td colSpan={2}>{renderedIssues}</td>
      </tr>
    );
  }

  function generateTable(configuration, issueCache: Map<number, any>): ReactNode {
    if (issueCache.size === 0) return null;

    const tableContents = configuration.split('\n').map((lineContent, zeroBasedLineNumber) => [
      <tr>
        <td className={classes.lineNumber}>{zeroBasedLineNumber + 1}</td>
        <td className={classes.lineContent}>
          <span>{lineContent}</span>
        </td>
      </tr>,
      getIssuesForLine(issueCache, zeroBasedLineNumber + 1),
    ]);

    const extraLines = issueCache.get(0)
      ? issueCache.get(0).map(issue => [
          <mui.Alert className={classes.issue} severity={issue.level.toLowerCase()}>
            {issue.message}
          </mui.Alert>,
        ])
      : null;

    return (
      <>
        <table className={classes.configurationTable} cellPadding={0}>
          <tbody>{tableContents}</tbody>
        </table>
        {extraLines != null && <br />}
        {extraLines}
      </>
    );
  }

  const yamlIssues = build.parsingResult.issues.filter(
    issue => issue.path.endsWith('.cirrus.yml') || issue.path.endsWith('.cirrus.yaml'),
  );
  const yamlIssueCache = cacheIssues(yamlIssues);
  const yamlTable = generateTable(build.parsingResult.processedYamlConfig, yamlIssueCache);

  const starlarkIssues = build.parsingResult.issues.filter(issue => issue.path.endsWith('.cirrus.star'));
  const starlarkIssueCache = cacheIssues(starlarkIssues);
  const starlarkTable = generateTable(build.parsingResult.rawStarlarkConfig, starlarkIssueCache);

  let yamlTitle: JSX.Element | null = (
    <mui.Typography variant="subtitle1">
      <p>YAML configuration</p>
    </mui.Typography>
  );
  let starlarkTitle: JSX.Element | null = (
    <mui.Typography variant="subtitle1" className={classes.topPadded}>
      <p>Starlark configuration</p>
    </mui.Typography>
  );

  let summaryText: string | null = null;

  const yamlHasErrors = yamlIssues.some(it => it.level === 'ERROR');
  const yamlHasIssues = yamlIssues.some(it => it.level !== 'ERROR');
  const starlarkHasErrors = starlarkIssues.some(it => it.level === 'ERROR');
  const starlarkHasIssues = starlarkIssues.some(it => it.level !== 'ERROR');

  if (yamlHasErrors && starlarkHasErrors) {
    summaryText = 'Failed to parse YAML and Starlark configurations';
  } else if (yamlHasIssues && starlarkHasIssues) {
    summaryText = 'Found issues while parsing YAML and Starlark configurations';
  } else if (yamlHasErrors) {
    summaryText = 'Failed to parse YAML configuration';
    yamlTitle = null;
    starlarkTitle = null;
  } else if (starlarkHasErrors) {
    summaryText = 'Failed to evaluate Starlark configuration';
    yamlTitle = null;
    starlarkTitle = null;
  } else if (yamlHasIssues) {
    summaryText = 'Found issues while parsing YAML configuration';
    yamlTitle = null;
    starlarkTitle = null;
  } else if (starlarkHasIssues) {
    summaryText = 'Found issues while evaluating Starlark configuration';
    yamlTitle = null;
    starlarkTitle = null;
  }

  return (
    <mui.Accordion defaultExpanded={yamlHasErrors || starlarkHasErrors}>
      <mui.AccordionSummary expandIcon={<mui.icons.ExpandMore />}>
        <mui.Typography variant="h6">{summaryText}</mui.Typography>
      </mui.AccordionSummary>
      <mui.AccordionDetails className={classes.columnFlexDirection}>
        {yamlTitle}
        {yamlTable}
        {starlarkTitle}
        {starlarkTable}
      </mui.AccordionDetails>
    </mui.Accordion>
  );
}
