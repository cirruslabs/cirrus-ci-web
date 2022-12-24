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
import Typography from '@mui/material/Typography';
import createStyles from '@mui/styles/createStyles';

import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import { muiThemeOptions } from '../../cirrusTheme';
import { absoluteLink } from '../../utils/link';
import { isBuildFinalStatus } from '../../utils/status';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import BuildHash from './BuildHash';
import BuildBranch from './BuildBranch';
import BuildDuration from './BuildDuration';

import { BuildTable_builds } from './__generated__/BuildTable_builds.graphql';

import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

// todo: move custom values to mui theme adjustments
const styles = theme =>
  createStyles({
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
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
      '& > div': { justifyContent: 'flex-end' },
    },
    infoIcon: {
      color: theme.palette.action.active,
    },
    commitName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
  });

const styled = withStyles(styles);

interface Props extends WithStyles<typeof styles> {
  builds: BuildTable_builds;
  selectedBuildId?: string;
  setSelectedBuildId?: Function;
}

const buildSubscription = graphql`
  subscription BuildTableSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildTable_builds
    }
  }
`;

const BuildTable = styled(({ classes, builds = [], selectedBuildId, setSelectedBuildId }: Props) => {
  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={muiTheme}>
      <Table>
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
  build: BuildTable_builds[number];
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
          <Typography className={classes.commitName} title={build.changeMessageTitle}>
            {build.changeMessageTitle}
          </Typography>
          <Stack height={theme.spacing(0.5)} />
          <BuildHash build={build} />
        </TableCell>

        {/* BRANCH */}
        <TableCell className={cx(classes.cell, classes.cellBranch)}>
          <BuildBranch build={build} />
        </TableCell>

        {/* DURATION */}
        <TableCell className={cx(classes.cell, classes.cellDuration)}>
          <BuildDuration build={build} />
        </TableCell>
      </TableRow>
    );
  }),
);

export default createFragmentContainer(BuildTable, {
  builds: graphql`
    fragment BuildTable_builds on Build @relay(plural: true) {
      id
      status
      changeMessageTitle
      repository {
        platform
        owner
        name
      }
      ...BuildHash_build
      ...BuildBranch_build
      ...BuildDuration_build
    }
  `,
});
