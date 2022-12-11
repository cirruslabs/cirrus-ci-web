import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { createFragmentContainer } from 'react-relay';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { graphql } from 'babel-plugin-relay/macro';

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

import { BuildsTable_build } from './__generated__/BuildsTable_build.graphql';
import { BuildsTable_repository } from './__generated__/BuildsTable_repository.graphql';

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
  builds: Array<BuildsTable_build>;
  repository: BuildsTable_repository;
  selectedBuildId?: string;
}

const BuildsTable = styled(({ classes, builds = [], repository, selectedBuildId }: Props) => {
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
            <BuildRow key={build.id} build={build} repository={repository} selectedBuildId={selectedBuildId} />
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
  build: BuildsTable_build;
  repository: BuildsTable_repository;
  selectedBuildId?: string;
}

const BuildRow = styled(({ classes, build, repository, selectedBuildId }: BuildRowProps) => {
  return null;
});

export default createFragmentContainer(BuildsTable, {
  build: graphql`
    fragment BuildsTable_build on Build {
      id
      branch
      status
      changeIdInRepo
      changeMessageTitle
      clockDurationInSeconds
    }
  `,
  repository: graphql`
    fragment BuildsTable_repository on Repository {
      platform
      owner
      name
    }
  `,
});
