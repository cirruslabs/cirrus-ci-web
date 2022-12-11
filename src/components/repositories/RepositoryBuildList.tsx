import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Helmet as Head } from 'react-helmet';

import { WithStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import withStyles from '@mui/styles/withStyles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Settings from '@mui/icons-material/Settings';
import AddCircle from '@mui/icons-material/AddCircle';
import Timeline from '@mui/icons-material/Timeline';

import { absoluteLink } from '../../utils/link';
import { createLinkToRepository } from '../../utils/github';
import { NodeOfConnection } from '../../utils/utility-types';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import environment from '../../createRelayEnvironment';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import BuildStatusChip from '../chips/BuildStatusChip';
import CreateBuildDialog from '../builds/CreateBuildDialog';
import BuildDurationsChart from '../builds/BuildDurationsChart';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import MarkdownTypography from '../common/MarkdownTypography';

import { RepositoryBuildList_repository } from './__generated__/RepositoryBuildList_repository.graphql';

const styles = theme => ({
  paper: {
    padding: theme.spacing(1.5, 2.5),
    boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
    borderRadius: 8,
  },
  header: {
    paddingLeft: 14,
  },
  gap: {
    paddingTop: 16,
  },
  chip: {
    margin: 4,
  },
  cell: {
    width: '100%',
    maxWidth: '600px',
  },
  buildsChart: {
    height: 150,
  },
});

interface Props extends WithStyles<typeof styles> {
  branch?: string;
  repository: RepositoryBuildList_repository;
}

const repositorySubscription = graphql`
  subscription RepositoryBuildListSubscription($repositoryID: ID!, $branch: String) {
    repository(id: $repositoryID) {
      ...RepositoryBuildList_repository @arguments(branch: $branch)
    }
  }
`;

function RepositoryBuildList(props: Props) {
  useEffect(() => {
    let variables = { repositoryID: props.repository.id, branch: props.branch };

    const subscription = requestSubscription(environment, {
      subscription: repositorySubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.repository.id, props.branch]);

  let navigate = useNavigate();
  let [selectedBuildId, setSelectedBuildId] = useState(null);
  let [openCreateDialog, setOpenCreateDialog] = useState(false);
  let { repository, classes } = props;
  let builds = repository.builds.edges.map(edge => edge.node, styles);

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

  if (props.branch && builds.length > 5) {
    buildsChart = (
      <Paper className={classes.paper} sx={{ marginBottom: 2 }}>
        <Typography className={classes.header} variant="h4" color="inherit">
          Duration Chart
        </Typography>
        <div className={classes.buildsChart}>
          <BuildDurationsChart
            builds={builds.slice().reverse()}
            selectedBuildId={selectedBuildId}
            onSelectBuildId={buildId => setSelectedBuildId(buildId)}
          />
        </div>
      </Paper>
    );
  }

  function buildItem(build: NodeOfConnection<RepositoryBuildList_repository['builds']>) {
    let isSelectedBuild = selectedBuildId === build.id;
    return (
      <TableRow
        key={build.id}
        hover={true}
        selected={isSelectedBuild}
        onMouseOver={() => !isSelectedBuild && setSelectedBuildId(build.id)}
        onClick={e => navigateBuildHelper(navigate, e, build.id)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell padding="none">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
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
        <TableCell
          className={classes.cell}
          sx={{
            display: { xs: 'none', sm: 'table-cell' },
            alignItems: 'center',
          }}
        >
          <BuildStatusChip build={build} className={classes.chip} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div>
      <AppBreadcrumbs
        platform={repository.platform}
        ownerName={repository.owner}
        repositoryName={repository.name}
        branchName={props.branch}
      />
      <Head>
        <title>
          {repository.owner}/{repository.name} - Cirrus CI
        </title>
      </Head>

      {/* CHART */}
      {buildsChart}

      {/* BUILDS TABLE */}
      <Paper className={classes.paper}>
        <Toolbar className={classes.header} sx={{ justifyContent: 'space-between' }} disableGutters>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h4" color="inherit">
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
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>{builds.map(build => buildItem(build))}</TableBody>
        </Table>
      </Paper>
      {openCreateDialog && (
        <CreateBuildDialog repository={repository} open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} />
      )}
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(RepositoryBuildList), {
  repository: graphql`
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
            changeMessageTitle
            durationInSeconds
            status
            ...BuildBranchNameChip_build
            ...BuildChangeChip_build
            ...BuildStatusChip_build
          }
        }
      }
    }
  `,
});
