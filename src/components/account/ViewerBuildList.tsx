import { useState } from 'react';
import { useRefetchableFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Helmet as Head } from 'react-helmet';

import { makeStyles } from '@mui/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import BuildCard from '../../components/builds/BuildCard';
import { isBuildFinalStatus } from '../../utils/status';
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
    emptyBuilds: {
      margin: theme.spacing(1.0),
      marginLeft: 14,
    },
  };
});

interface Props {
  viewer: ViewerBuildList_viewer$key;
}

function ViewerBuildList(props: Props) {
  let { viewer } = props;
  let classes = useStyles();

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
                status
                ...BuildCard_build
              }
            }
          }
        }
      }
    `,
    viewer,
  );

  const [filter, setFilter] = useState('all');

  let builds = [];

  if (data.viewer.builds) {
    builds = data.viewer.builds.edges
      .map(edge => edge.node)
      .filter(build => {
        return !(filter === 'running' && isBuildFinalStatus(build.status));
      });
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
      {builds.length === 0 ? (
        <div className={classes.emptyBuilds}>
          <MarkdownTypography
            text={
              'No recent builds! Please check the [documentation](https://cirrus-ci.org/) on how to start with Cirrus CI.'
            }
          />
        </div>
      ) : (
        builds.map(build => <BuildCard build={build} />)
      )}
    </Paper>
  );
}

export default ViewerBuildList;
