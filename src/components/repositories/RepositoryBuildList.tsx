import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useFragment, useSubscription } from 'react-relay';
import { Link as RouterLink } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import cx from 'classnames';

import AddCircle from '@mui/icons-material/AddCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import Settings from '@mui/icons-material/Settings';
import Timeline from '@mui/icons-material/Timeline';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import BuildCard from 'components/builds/BuildCard';
import BuildDurationsChart from 'components/builds/BuildDurationsChart';
import CreateBuildDialog from 'components/builds/CreateBuildDialog';
import { createLinkToRepository } from 'utils/github';
import { absoluteLink } from 'utils/link';

import { RepositoryBuildList_repository$key } from './__generated__/RepositoryBuildList_repository.graphql';

// todo: move custom values to mui theme adjustments
const useStyles = makeStyles(theme => {
  return {
    root: {
      paddingBottom: theme.spacing(16.0),
    },
    paper: {
      padding: theme.spacing(1.0, 2.5, 1.5),
      boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      borderRadius: 4 * theme.shape.borderRadius,
    },
    paperBuilds: {
      paddingBottom: theme.spacing(4.0),
    },
    header: {
      paddingLeft: 14,
      justifyContent: 'space-between',
    },
    buildsChart: {
      height: 150,
    },
  };
});

interface Props {
  branch?: string;
  repository: RepositoryBuildList_repository$key;
}

const repositorySubscription = graphql`
  subscription RepositoryBuildListSubscription($repositoryID: ID!, $branch: String) {
    repository(id: $repositoryID) {
      ...RepositoryBuildList_repository @arguments(branch: $branch)
    }
  }
`;

export default function RepositoryBuildList(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryBuildList_repository on Repository @argumentDefinitions(branch: { type: "String" }) {
        id
        platform
        owner
        name
        viewerPermission
        ...CreateBuildDialog_repository
        builds(last: 50, branch: $branch) {
          edges {
            node {
              id
              clockDurationInSeconds
              status
              ...BuildCard_build
            }
          }
        }
      }
    `,
    props.repository,
  );

  const repositorySubscriptionConfig = useMemo(
    () => ({
      variables: { repositoryID: repository.id, branch: props.branch },
      subscription: repositorySubscription,
    }),
    [repository.id, props.branch],
  );
  useSubscription(repositorySubscriptionConfig);

  let [openCreateDialog, setOpenCreateDialog] = useState(false);
  let classes = useStyles();
  let builds = repository.builds.edges.map(edge => edge.node);

  let repositorySettings: null | JSX.Element = null;
  let repositoryAction: null | JSX.Element = null;
  if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
    repositorySettings = (
      <Tooltip title="Repository Settings">
        <IconButton component={RouterLink} to={'/settings/repository/' + repository.id} size="large">
          <Settings />
        </IconButton>
      </Tooltip>
    );

    repositoryAction = (
      <>
        <div key="create-build-gap" />
        <Tooltip title="Create Build">
          <IconButton key="create-build-button" onClick={() => setOpenCreateDialog(true)} size="large">
            <AddCircle />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  let repositoryMetrics = (
    <Tooltip title="Repository Metrics">
      <IconButton
        component={RouterLink}
        to={absoluteLink('metrics', 'repository', repository.platform, repository.owner, repository.name)}
        size="large"
      >
        <Timeline />
      </IconButton>
    </Tooltip>
  );

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <IconButton
        component={Link}
        href={createLinkToRepository(repository, props.branch)}
        target="_blank"
        rel="noopener noreferrer"
        size="large"
      >
        <GitHubIcon />
      </IconButton>
    </Tooltip>
  );

  let buildsChart: null | JSX.Element = null;

  const isDisplayBuildChart = props.branch && builds.length > 5;

  if (isDisplayBuildChart) {
    buildsChart = (
      <Paper className={classes.paper} sx={{ mb: 2 }}>
        <Toolbar className={classes.header} disableGutters>
          <Typography variant="h5" color="inherit">
            Duration Chart
          </Typography>
        </Toolbar>
        <div className={classes.buildsChart}>
          <BuildDurationsChart builds={builds.slice().reverse()} />
        </div>
      </Paper>
    );
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>
          {repository.owner}/{repository.name} - Cirrus CI
        </title>
      </Helmet>
      {/* CHART */}
      {buildsChart}

      {/* BUILDS */}
      <Paper className={cx(classes.paper, classes.paperBuilds)}>
        <Toolbar className={classes.header} disableGutters>
          <Stack direction="row" alignItems="center">
            <Typography variant="h5" color="inherit">
              Builds
            </Typography>
            {repositoryAction}
          </Stack>
          <div>
            {repositoryMetrics}
            {repositoryLinkButton}
            {repositorySettings}
          </div>
        </Toolbar>

        {builds.map(build => (
          <BuildCard key={build.id} build={build} />
        ))}
      </Paper>
      {openCreateDialog && (
        <CreateBuildDialog repository={repository} open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} />
      )}
    </div>
  );
}
