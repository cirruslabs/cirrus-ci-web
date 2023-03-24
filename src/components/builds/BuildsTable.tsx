import { memo, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { requestSubscription, useFragment } from 'react-relay';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';

import { Link, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import UnarchiveIcon from '@mui/icons-material/UnarchiveOutlined';

import Hash from '../chips/Hash';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import { muiThemeOptions } from '../../cirrusTheme';
import { shorten } from '../../utils/text';
import { absoluteLink } from '../../utils/link';
import { formatDuration } from '../../utils/time';
import { isBuildFinalStatus } from '../../utils/status';
import { navigateBuildHelper } from '../../utils/navigateHelper';

import { BuildsTable_builds, BuildsTable_builds$key } from './__generated__/BuildsTable_builds.graphql';

// todo: move custom values to mui theme adjustments
const useStyles = makeStyles(theme => {
  return {
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
      overflowWrap: 'anywhere',
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
        fontSize: '15px !important',
        color: theme.palette.background.default,
      },
    },
    cellRepository: {
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    cellCommit: {},
    cellBranch: {
      width: 180,
      minWidth: 180,
      maxWidth: 180,
    },
    cellDuration: {
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      textAlign: 'right',
    },
    infoIcon: {
      color: theme.palette.action.active,
    },
    link: {
      // default palette.primary.main colors
      color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.main,
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
  };
});

interface Props {
  builds: BuildsTable_builds$key;
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

export default function BuildsTable({ selectedBuildId, setSelectedBuildId, ...props }: Props) {
  let builds = useFragment(
    graphql`
      fragment BuildsTable_builds on Build @relay(plural: true) {
        id
        branch
        tag
        status
        changeIdInRepo
        changeMessageTitle
        clockDurationInSeconds
        repository {
          platform
          owner
          name
          ...RepositoryNameChipNew_repository
        }
        ...Hash_build
        ...BuildBranchNameChipNew_build
      }
    `,
    props.builds,
  );

  let classes = useStyles();
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
}
const HeadRow = () => {
  let classes = useStyles();
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
};

interface BuildRowProps {
  build: BuildsTable_builds[number];
  selected?: boolean;
  setSelectedBuildId?: Function;
}

const BuildRow = memo(({ build, selected, setSelectedBuildId }: BuildRowProps) => {
  let classes = useStyles();
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
      onMouseEnter() {
        if (selected) return;
        setSelectedBuildId(build.id);
      },
      onMouseLeave() {
        setSelectedBuildId(null);
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
        <RepositoryNameChipNew repository={build.repository} />
        <Typography noWrap color={theme.palette.text.secondary} title={build.repository.owner}>
          by {build.repository.owner}
        </Typography>
      </TableCell>

      {/* COMMIT */}
      <TableCell className={cx(classes.cell, classes.cellCommit)}>
        <Typography className={classes.commitName} title={build.changeMessageTitle}>
          {build.changeMessageTitle}
        </Typography>
        <Hash build={build} />
      </TableCell>

      {/* BRANCH */}
      <TableCell className={cx(classes.cell, classes.cellBranch)}>
        <BuildBranchNameChipNew build={build} />
      </TableCell>

      {/* DURATION */}
      <TableCell className={cx(classes.cell, classes.cellDuration)}>
        {build.clockDurationInSeconds ? formatDuration(build.clockDurationInSeconds) : '—'}
      </TableCell>
    </TableRow>
  );
});
