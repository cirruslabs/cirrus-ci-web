import { useState, useMemo } from 'react';
import { useRefetchableFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useRecoilValue } from 'recoil';
import { Helmet as Head } from 'react-helmet';

import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Hash from '../chips/Hash';
import Duration from '../chips/Duration';
import { muiThemeOptions } from '../../cirrusTheme';
import RepositoryNameChipNew from '../chips/RepositoryNameChipNew';
import RepositoryOwnerChipNew from '../chips/RepositoryOwnerChipNew';
import BuildBranchNameChipNew from '../chips/BuildBranchNameChipNew';
import BuildStatusChipNew from '../chips/BuildStatusChipNew';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import usePageWidth from '../../utils/usePageWidth';
import { isBuildFinalStatus } from '../../utils/status';
import BuildsTable from '../../components/builds/BuildsTable';
import MarkdownTypography from '../common/MarkdownTypography';
import { ViewerBuildListRefetchQuery } from './__generated__/ViewerBuildListRefetchQuery.graphql';
import { ViewerBuildList_viewer$key } from './__generated__/ViewerBuildList_viewer.graphql';

// todo: move custom values to mui theme adjustments
const useStyles = makeStyles(theme => {
  return {
    paper: {
      marginTop: theme.spacing(4),
      padding: theme.spacing(1.0, 2.5, 1.5),
      boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      borderRadius: 4 * theme.shape.borderRadius,
    },
    header: {
      paddingLeft: 14,
      justifyContent: 'space-between',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    cell: {
      width: '100%',
      maxWidth: '600px',
    },
    emptyBuilds: {
      margin: theme.spacing(1.0),
      marginLeft: 14,
    },
    padding: {
      margin: theme.spacing(0.5),
    },
    statusChip: {
      '& *': {
        color: theme.palette.background.default,
      },
    },
  };
});

interface Props {
  viewer: ViewerBuildList_viewer$key;
}

function ViewerBuildList(props: Props) {
  let { viewer } = props;
  let classes = useStyles();
  const pageWidth = usePageWidth();
  const isNewDesign = pageWidth > 900;

  const [data, refetch] = useRefetchableFragment<ViewerBuildListRefetchQuery, any>(
    graphql`
      fragment ViewerBuildList_viewer on Query
      @argumentDefinitions(statuses: { type: "[BuildStatus!]" })
      @refetchable(queryName: "ViewerBuildListRefetchQuery") {
        viewer {
          builds(last: 50, statuses: $statuses) {
            edges {
              node {
                id
                changeMessageTitle
                durationInSeconds
                status
                ...Hash_build
                ...Duration_build
                ...BuildsTable_builds
                ...BuildBranchNameChipNew_build
                repository {
                  ...RepositoryNameChipNew_repository
                  ...RepositoryOwnerChipNew_repository
                }
              }
            }
          }
        }
      }
    `,
    viewer,
  );

  let navigate = useNavigate();

  const themeOptions = useRecoilValue(muiThemeOptions);
  const muiTheme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  function buildItem(build) {
    return (
      <TableRow
        key={build.id}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        hover={true}
        style={{ cursor: 'pointer' }}
      >
        {/* STATUS REPOSITORY BRANCH */}
        <TableCell className={classes.padding}>
          <Stack direction="column" alignItems="start" spacing={0.5}>
            <div className={classes.statusChip}>
              <BuildStatusChipNew status={build.status} />
            </div>
            {/* DURATION XS-SCREEN */}
            <Box component="span" sx={{ display: { xs: 'block', sm: 'none' } }} pl={0.5}>
              <Duration build={build} iconFirst />
            </Box>
            <RepositoryNameChipNew repository={build.repository} />
            <RepositoryOwnerChipNew repository={build.repository} />
          </Stack>
        </TableCell>

        {/* COMMIT */}
        <TableCell className={classes.cell}>
          <Typography variant="subtitle1" title={build.changeMessageTitle} gutterBottom>
            {build.changeMessageTitle}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Hash build={build} />
            <BuildBranchNameChipNew build={build} />
          </Stack>
        </TableCell>

        {/* DURATION SM-SCREEN */}
        <TableCell className={classes.cell} sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
          <Duration build={build} rightAlighment />
        </TableCell>
      </TableRow>
    );
  }

  const [filter, setFilter] = useState('all');

  let builds = [];

  if (data.viewer.builds) {
    builds = data.viewer.builds.edges
      .map(edge => edge.node)
      .filter(build => {
        return !(filter === 'running' && isBuildFinalStatus(build.status));
      });
  }

  let buildsComponent = isNewDesign ? (
    <BuildsTable builds={builds} />
  ) : (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>{builds.map(build => buildItem(build))}</TableBody>
    </Table>
  );
  if (builds.length === 0) {
    buildsComponent = (
      <div className={classes.emptyBuilds}>
        <MarkdownTypography
          text={
            'No recent builds! Please check the [documentation](https://cirrus-ci.org/) on how to start with Cirrus CI.'
          }
        />
      </div>
    );
  }

  const handleFilterChange = (event, newFilter) => {
    // This prevents the depressing of the toggle button
    // without pressing another button.
    if (!newFilter) {
      return;
    }

    setFilter(newFilter);

    switch (newFilter) {
      case 'all':
        refetch({ statuses: [] });
        break;
      case 'running':
        refetch({ statuses: ['CREATED', 'NEEDS_APPROVAL', 'TRIGGERED', 'EXECUTING'] });
        break;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Paper className={classes.paper}>
        <Head>
          <title>Recent Builds - Cirrus CI</title>
        </Head>
        <Toolbar className={classes.header} disableGutters>
          <Typography variant="h5">Recent Builds</Typography>
          <ToggleButtonGroup value={filter} exclusive onChange={handleFilterChange}>
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="running">Running</ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
        {buildsComponent}
      </Paper>
    </ThemeProvider>
  );
}

export default ViewerBuildList;
