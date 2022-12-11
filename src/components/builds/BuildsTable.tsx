import React from 'react';
import { ThemeProvider } from '@emotion/react';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import { WithStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import withStyles from '@mui/styles/withStyles';
import InfoIcon from '@mui/icons-material/Info';
import createStyles from '@mui/styles/createStyles';

import { muiThemeOptions } from '../../cirrusTheme';

const styles = theme =>
  createStyles({
    table: {
      tableLayout: 'auto',
    },
    cell: {
      fontSize: 16,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      '& *': {
        fontSize: '16px !important',
      },
    },
    cellStatus: {
      width: 160,
      minWidth: 160,
      maxWidth: 160,
    },
    cellCommit: {},
    cellHash: {
      width: 140,
      minWidth: 140,
      maxWidth: 140,
    },
    cellBranch: {
      width: 210,
      minWidth: 210,
      maxWidth: 210,
    },
    cellDuration: {
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      textAlign: 'right',
    },
    infoIcon: {
      color: theme.palette.action.active,
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  builds?: Array<{ id: number }>;
}

const BuildsTable = styled(({ classes, builds = [] }: Props) => {
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = React.useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Table className={classes.table}>
        <TableHead>
          <HeadRow />
        </TableHead>
        <TableBody>
          {builds.map((build, i) => (
            <BuildRow key={build.id} build={build} />
          ))}
        </TableBody>
      </Table>
    </ThemeProvider>
  );
});

interface HeadRowProps extends WithStyles<typeof styles> {}

const HeadRow = styled(({ classes }: HeadRowProps) => {
  const durationTooltipText = (
    <>
      Clock duration reflects elapsed time between creation of all tasks for a particular build and completion of the
      last one of them. Clock duration can be impacted by resource availability, scheduling delays, parallelism
      constraints and other factors that affect execution of tasks.
    </>
  );

  return (
    <TableRow>
      <TableCell className={cx(classes.cell, classes.cellStatus)}>Status</TableCell>
      <TableCell className={cx(classes.cell, classes.cellCommit)}>Commit Name</TableCell>
      <TableCell className={cx(classes.cell, classes.cellHash)}>Commit Hash</TableCell>
      <TableCell className={cx(classes.cell, classes.cellBranch)}>Branch</TableCell>
      <TableCell className={cx(classes.cell, classes.cellDuration)}>
        <Stack direction="row" alignItems="center" justifyContent="end" spacing={0.5}>
          <Tooltip title={durationTooltipText}>
            <InfoIcon className={classes.infoIcon} fontSize="inherit" />
          </Tooltip>
          <span>Duration</span>
        </Stack>
      </TableCell>
    </TableRow>
  );
});

interface BuildRowProps extends WithStyles<typeof styles> {
  build: Object;
}

const BuildRow = styled(({ classes }: BuildRowProps) => {
  return null;
});

export default BuildsTable;
