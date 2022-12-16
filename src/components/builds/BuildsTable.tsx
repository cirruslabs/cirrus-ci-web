import { memo, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';

import { useTheme } from '@mui/material';
import { WithStyles } from '@mui/styles';
import { Link } from '@mui/material';
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
import CommitIcon from '@mui/icons-material/Commit';
import Typography from '@mui/material/Typography';
import createStyles from '@mui/styles/createStyles';
import CallSplitIcon from '@mui/icons-material/CallSplit';

import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import { muiThemeOptions } from '../../cirrusTheme';
import { shorten } from '../../utils/text';
import { absoluteLink } from '../../utils/link';
import { formatDuration } from '../../utils/time';
import { isBuildFinalStatus } from '../../utils/status';
import { navigateBuildHelper } from '../../utils/navigateHelper';

import { BuildsTable_builds } from './__generated__/BuildsTable_builds.graphql';

import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

// todo: move custom values to mui theme adjustments
const styles = theme =>
  createStyles({
    table: {
      tableLayout: 'auto',
    },
    row: {
      height: 82,
      cursor: 'pointer',
      '&.Mui-selected': {
        background: `${
          theme.palette.mode === 'dark' ? theme.palette.grey['800'] : theme.palette.grey['100']
        } !important`,
      },
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
      width: 150,
      minWidth: 150,
      maxWidth: 150,
    },
    cellStatusChip: {
      '& *': {
        fontSize: '14px !important',
      },
    },
    cellRepository: {
      width: 200,
      minWidth: 200,
      maxWidth: 200,
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
      width: 130,
      minWidth: 130,
      maxWidth: 130,
      textAlign: 'right',
    },
    infoIcon: {
      color: theme.palette.action.active,
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  builds: BuildsTable_builds;
  selectedBuildId?: string;
  setSelectedBuildId?: Function;
}

const buildSubscription = graphql`
  subscription BuildsTableSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildsTable_builds
    }
  }
`;

const BuildsTable = styled(({ classes, builds = [], selectedBuildId, setSelectedBuildId }: Props) => {
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Table className={classes.table}>
        <TableHead>
          <HeadRow />
        </TableHead>
        <TableBody>
          {builds.map((build, i) => (
            <BuildRow
              key={build.id}
              build={build}
              selected={selectedBuildId === build.id}
              setSelectedBuildId={setSelectedBuildId}
            />
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
      <TableCell className={cx(classes.cell, classes.cellRepository)}>Repository</TableCell>
      <TableCell className={cx(classes.cell, classes.cellCommit)}>Commit</TableCell>
      <TableCell className={cx(classes.cell, classes.cellHash)}>Hash</TableCell>
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
  build: BuildsTable_builds[number];
  selected?: boolean;
  setSelectedBuildId?: Function;
}

const BuildRow = styled(
  memo(({ classes, build, selected, setSelectedBuildId }: BuildRowProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const isFinalStatus = useMemo(() => isBuildFinalStatus(build.status), [build.status]);
    useEffect(() => {
      if (isFinalStatus) return;
      const subscription = requestSubscription(environment, {
        subscription: buildSubscription,
        variables: { buildID: build.id },
      });
      return () => {
        subscription.dispose();
      };
    }, [build.id, isFinalStatus]);

    let rowProps;
    const selectable = !!setSelectedBuildId;
    if (selectable) {
      rowProps = {
        selected: selected,
        onMouseOver() {
          if (selected) return;
          setSelectedBuildId(build.id);
        },
      };
    } else {
      rowProps = {
        hover: true,
      };
    }

    return (
      <TableRow
        className={classes.row}
        {...rowProps}
        onClick={e => {
          const target = e.target as HTMLElement;
          if (target.closest('a')) return;
          navigateBuildHelper(navigate, e, build.id);
        }}
      >
        {/* STATUS */}
        <TableCell className={cx(classes.cell, classes.cellStatus, classes.cellStatusChip)}>
          <BuildStatusChipNew status={build.status} />
        </TableCell>

        {/* REPOSITORY */}
        <TableCell className={cx(classes.cell, classes.cellRepository)}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <BookOutlinedIcon fontSize="inherit" />
            <Link
              href={absoluteLink(build.repository.platform, build.repository.owner, build.repository.name)}
              underline="hover"
              noWrap
              title={build.repository.name}
            >
              {build.repository.name}
            </Link>
          </Stack>
          <Typography noWrap color={theme.palette.text.secondary} title={build.repository.owner}>
            by {build.repository.owner}
          </Typography>
        </TableCell>

        {/* COMMIT */}
        <TableCell className={cx(classes.cell, classes.cellCommit)}>
          <div style={{ position: 'relative', width: '100%', height: 24 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ position: 'absolute', right: '0', left: '0' }}
            >
              <CommitIcon fontSize="inherit" />
              <Typography noWrap title={build.changeMessageTitle}>
                {build.changeMessageTitle}
              </Typography>
            </Stack>
          </div>
        </TableCell>

        {/* HASH */}
        <TableCell className={cx(classes.cell, classes.cellHash)}>
          <Typography color={theme.palette.text.secondary}>{build.changeIdInRepo.substr(0, 7)}</Typography>
        </TableCell>

        {/* BRANCH */}
        <TableCell className={cx(classes.cell, classes.cellBranch)}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CallSplitIcon fontSize="inherit" />
            <Link
              href={absoluteLink(
                build.repository.platform,
                build.repository.owner,
                build.repository.name,
                build.branch,
              )}
              underline="hover"
              noWrap
              title={build.branch}
            >
              {shorten(build.branch)}
            </Link>
          </Stack>
        </TableCell>

        {/* DURATION */}
        <TableCell className={cx(classes.cell, classes.cellDuration)}>
          {build.clockDurationInSeconds ? formatDuration(build.clockDurationInSeconds) : '—'}
        </TableCell>
      </TableRow>
    );
  }),
);

export default createFragmentContainer(BuildsTable, {
  builds: graphql`
    fragment BuildsTable_builds on Build @relay(plural: true) {
      id
      branch
      status
      changeIdInRepo
      changeMessageTitle
      clockDurationInSeconds
      repository {
        platform
        owner
        name
      }
    }
  `,
});
