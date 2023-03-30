import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useFragment } from 'react-relay';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import { muiThemeOptions } from '../../cirrusTheme';
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
      whiteSpace: 'nowrap',
      overflowWrap: 'anywhere',
      textOverflow: 'ellipsis',
    },
    cellStatus: {
      width: 150,
      minWidth: 150,
      maxWidth: 150,
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
      verticalAlign: 'text-top',
    },
    cellDuration: {
      width: 110,
      minWidth: 110,
      maxWidth: 110,
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
          ...RepositoryOwnerChipNew_repository
        }
        ...Hash_build
        ...Duration_build
        ...BuildStatusChipNew_build
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

interface BuildRowProps {
  build: BuildsTable_builds[number];
  selected?: boolean;
  setSelectedBuildId?: Function;
}

const BuildRow = memo(({ build, selected, setSelectedBuildId }: BuildRowProps) => {
  let classes = useStyles();
  const navigate = useNavigate();

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
      <TableCell className={cx(classes.cell, classes.cellStatus)}>
        <BuildStatusChipNew build={build} />
      </TableCell>

      {/* COMMIT */}
      <TableCell className={cx(classes.cell, classes.cellCommit)}>
        <Typography
          className={classes.commitName}
          variant="subtitle1"
          title={build.changeMessageTitle}
          gutterBottom
          lineHeight={1}
        >
          {build.changeMessageTitle}
        </Typography>
        <Hash build={build} />
      </TableCell>

      {/* REPOSITORY */}
      <TableCell className={cx(classes.cell, classes.cellRepository)}>
        <RepositoryNameChipNew repository={build.repository} withHeader />
        <Box mb={0.5} />
        <RepositoryOwnerChipNew repository={build.repository} withHeader />
      </TableCell>

      {/* BRANCH */}
      <TableCell className={cx(classes.cell, classes.cellBranch)}>
        <BuildBranchNameChipNew build={build} withHeader />
      </TableCell>

      {/* DURATION */}
      <TableCell className={cx(classes.cell, classes.cellDuration)}>
        <Duration build={build} rightAlighment />
      </TableCell>
    </TableRow>
  );
});
