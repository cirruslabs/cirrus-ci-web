import React from 'react';
import createStyles from '@mui/styles/createStyles';
import { withStyles, WithStyles } from '@mui/styles';
import { Typography } from '@mui/material';

const styles = theme =>
  createStyles({
    gapped: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    scrollableLimiterContainer: {
      maxHeight: theme.spacing(80),
      overflow: 'auto',
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
  readonly title: string;
  readonly lines: ReadonlyArray<string>;
}

function InlineLogs(props: Props) {
  let { title, lines, classes } = props;

  if (!lines || lines.length === 0) {
    lines = [''];
  }

  const tableRows = lines.map((lineContent, zeroBasedLineNumber) => [
    <tr key={classes.lineNumber}>
      <td className={classes.lineNumber}>{zeroBasedLineNumber + 1}</td>
      <td className={classes.lineContent}>
        <span>{lineContent}</span>
      </td>
    </tr>,
  ]);

  return (
    <>
      <Typography variant="subtitle1" className={classes.gapped}>
        {title}
      </Typography>
      <div className={classes.scrollableLimiterContainer}>
        <table className={classes.configurationTable} cellPadding={0}>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </>
  );
}

export default withStyles(styles)(InlineLogs);
