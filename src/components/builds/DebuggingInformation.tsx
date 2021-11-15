import React from 'react';
import { CardContent, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { DebuggingInformation_build } from './__generated__/DebuggingInformation_build.graphql';

const styles = (theme: Theme) =>
  createStyles({
    scrollableLimiterContainer: {
      maxHeight: theme.spacing(80),
      overflow: 'auto',
    },
    gapped: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
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
  });

interface Props extends WithStyles<typeof styles> {
  build: DebuggingInformation_build;
}

function DebuggingInformation(props: Props) {
  let { build, classes } = props;

  if (!build.parsingResult) {
    return null;
  }

  function generateTable(lines) {
    const tableRows = lines.map((lineContent, zeroBasedLineNumber) => [
      <tr>
        <td className={classes.lineNumber}>{zeroBasedLineNumber + 1}</td>
        <td className={classes.lineContent}>
          <span>{lineContent}</span>
        </td>
      </tr>,
    ]);

    return (
      <div className={classes.scrollableLimiterContainer}>
        <table className={classes.configurationTable} cellPadding={0}>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }

  const starlarkInformation =
    build.parsingResult.rawStarlarkConfig === '' ? null : (
      <>
        <div className={classes.gapped}>Starlark configuration</div>
        {generateTable(build.parsingResult.rawStarlarkConfig.split('\n'))}
        <div className={classes.gapped}>Starlark logs</div>
        {generateTable(build.parsingResult.outputLogs)}
        <div className={classes.gapped}>Final configuration</div>
        {generateTable(build.parsingResult.processedYamlConfig.split('\n'))}
      </>
    );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Debugging Information</Typography>
        <div className={classes.gapped}>YAML configuration</div>
        {generateTable(build.parsingResult.rawYamlConfig.split('\n'))}
        <div className={classes.gapped}>Environment Variables</div>
        {generateTable(build.parsingResult.environment)}
        <div className={classes.gapped}>Affected Files</div>
        {generateTable(build.parsingResult.affectedFiles)}
        {starlarkInformation}
      </CardContent>
    </Card>
  );
}

export default createFragmentContainer(withStyles(styles)(DebuggingInformation), {
  build: graphql`
    fragment DebuggingInformation_build on Build {
      parsingResult {
        rawYamlConfig
        rawStarlarkConfig
        processedYamlConfig
        outputLogs
        environment
        affectedFiles
      }
    }
  `,
});
