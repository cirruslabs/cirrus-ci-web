import React, { useState } from 'react';
import { useRefetchableFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import Typography from '@mui/material/Typography';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { Helmet as Head } from 'react-helmet';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MarkdownTypography from '../common/MarkdownTypography';
import { ViewerBuildListRefetchQuery } from './__generated__/ViewerBuildListRefetchQuery.graphql';
import { ViewerBuildList_viewer$key } from './__generated__/ViewerBuildList_viewer.graphql';
import { isBuildFinalStatus } from '../../utils/status';
import BuildsTable from '../../components/builds/BuildsTable';

// todo: move custom values to mui theme adjustments
const styles = theme => ({
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
});

interface Props extends WithStyles<typeof styles> {
  viewer: ViewerBuildList_viewer$key;
  isNew?: boolean;
}

function ViewerBuildList(props: Props) {
  let { viewer, classes } = props;

  const [data, refetch] = useRefetchableFragment<ViewerBuildListRefetchQuery, any>(
    graphql`
      fragment ViewerBuildList_viewer on Query
      @argumentDefinitions(statuses: { type: "[BuildStatus]" })
      @refetchable(queryName: "ViewerBuildListRefetchQuery") {
        viewer {
          builds(last: 50, statuses: $statuses) {
            edges {
              node {
                id
                changeMessageTitle
                durationInSeconds
                status
                ...BuildBranchNameChip_build
                ...BuildChangeChip_build
                ...BuildStatusChip_build
                ...BuildsTable_builds
                repository {
                  ...RepositoryNameChip_repository
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

  function buildItem(build) {
    let { classes } = props;

    return (
      <TableRow
        key={build.id}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        hover={true}
        style={{ cursor: 'pointer' }}
      >
        <TableCell className={classes.padding}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            <RepositoryNameChip repository={build.repository} fullName={true} className={classes.chip} />
            <BuildBranchNameChip build={build} className={classes.chip} />
            <BuildChangeChip build={build} className={classes.chip} />
            <Box component="span" sx={{ display: { xs: 'block', sm: 'none' } }}>
              <BuildStatusChip build={build} className={classes.chip} />
            </Box>
          </div>
        </TableCell>
        <TableCell className={classes.cell}>
          <div>
            <MarkdownTypography text={build.changeMessageTitle} variant="body1" color="inherit" />
          </div>
        </TableCell>
        <TableCell className={classes.cell} sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
          <BuildStatusChip build={build} className={classes.chip} />
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

  let buildsComponent = props.isNew ? (
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
  );
}

export default withStyles(styles)(ViewerBuildList);
