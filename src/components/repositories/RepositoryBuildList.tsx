import { useState, useMemo } from 'react';
import { useFragment, useSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Helmet as Head } from 'react-helmet';
import cx from 'classnames';

import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Settings from '@mui/icons-material/Settings';
import AddCircle from '@mui/icons-material/AddCircle';
import Timeline from '@mui/icons-material/Timeline';

import { absoluteLink } from '../../utils/link';
import { createLinkToRepository } from '../../utils/github';
import CreateBuildDialog from '../builds/CreateBuildDialog';
import BuildDurationsChart from '../builds/BuildDurationsChart';
import BuildCard from '../../components/builds/BuildCard';
import { SelectedBuildProvider } from '../../contexts/SelectedBuildContext';

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

  let repositorySettings = null;
  let repositoryAction = null;
  if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
    repositorySettings = (
      <Tooltip title="Repository Settings">
        <Link href={'/settings/repository/' + repository.id}>
          <IconButton size="large">
            <Settings />
          </IconButton>
        </Link>
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
    <Link href={absoluteLink('metrics', 'repository', repository.platform, repository.owner, repository.name)}>
      <Tooltip title="Repository Metrics">
        <IconButton size="large">
          <Timeline />
        </IconButton>
      </Tooltip>
    </Link>
  );

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <Link href={createLinkToRepository(repository, props.branch)} target="_blank" rel="noopener noreferrer">
        <IconButton size="large">
          <GitHubIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );

  let buildsChart = null;

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
    <SelectedBuildProvider>
      <div className={classes.root}>
        <Head>
          <title>
            {repository.owner}/{repository.name} - Cirrus CI
          </title>
        </Head>
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
            <BuildCard build={build} selectable={isDisplayBuildChart} />
          ))}
        </Paper>
        {openCreateDialog && (
          <CreateBuildDialog
            repository={repository}
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
          />
        )}
      </div>
    </SelectedBuildProvider>
  );
}
