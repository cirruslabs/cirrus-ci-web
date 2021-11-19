import React, { useEffect, useState } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useNavigate } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import BuildDurationsChart from '../builds/BuildDurationsChart';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import GitHubIcon from '@mui/icons-material/GitHub';
import classNames from 'classnames';
import CreateBuildDialog from '../builds/CreateBuildDialog';
import { RepositoryBuildList_repository } from './__generated__/RepositoryBuildList_repository.graphql';
import { NodeOfConnection } from '../../utils/utility-types';
import { createLinkToRepository } from '../../utils/github';
import { Helmet as Head } from 'react-helmet';
import Settings from '@mui/icons-material/Settings';
import AddCircle from '@mui/icons-material/AddCircle';
import Timeline from '@mui/icons-material/Timeline';
import environment from '../../createRelayEnvironment';

let styles = createStyles({
  gap: {
    paddingTop: 16,
  },
  chip: {
    margin: 4,
  },
  cell: {
    padding: '5px',
    width: '100%',
    maxWidth: '600px',
  },
  buildsChart: {
    height: 150,
  },
  horizontalGap: {
    paddingLeft: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  row: {
    padding: '3px',
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
        <a href={'/settings/repository/' + repository.id}>
          <IconButton size="large">
            <Settings />
          </IconButton>
        </a>
      </Tooltip>
    );
    repositoryAction = (
      <>
        <div key="create-build-gap" className={classes.horizontalGap} />
        <Tooltip title="Create Build">
          <IconButton key="create-build-button" onClick={() => setOpenCreateDialog(true)} size="large">
            <AddCircle />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  let repositoryMetrics = (
    <a href={'/metrics/repository/' + repository.owner + '/' + repository.name}>
      <Tooltip title="Repository Metrics">
        <IconButton size="large">
          <Timeline />
        </IconButton>
      </Tooltip>
    </a>
  );

  const repositoryLinkButton = (
    <Tooltip title="Open on GitHub">
      <a href={createLinkToRepository(repository, props.branch)} target="_blank" rel="noopener noreferrer">
        <IconButton size="large">
          <GitHubIcon />
        </IconButton>
      </a>
    </Tooltip>
  );

  let buildsChart = null;

  if (props.branch && builds.length > 5) {
    buildsChart = (
      <Paper elevation={16} className={classes.buildsChart}>
        <BuildDurationsChart
          builds={builds.slice().reverse()}
          selectedBuildId={selectedBuildId}
          onSelectBuildId={buildId => setSelectedBuildId(buildId)}
        />
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
        <TableCell className={classes.row}>
          <div className="d-flex flex-column align-items-start">
            <BuildBranchNameChip build={build} className={classes.chip} />
            <BuildChangeChip build={build} className={classes.chip} />
            <BuildStatusChip build={build} className={classNames('d-lg-none', classes.chip)} />
          </div>
        </TableCell>
        <TableCell className={classes.cell}>
          <div className="card-body">
            <Typography variant="body1" color="inherit">
              {build.changeMessageTitle}
            </Typography>
          </div>
        </TableCell>
        <TableCell className={classNames('d-none', 'd-lg-table-cell', classes.cell)}>
          <BuildStatusChip build={build} className={classes.chip} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div>
      <Head>
        <title>
          {repository.owner}/{repository.name} - Cirrus CI
        </title>
      </Head>
      <Paper elevation={16}>
        <Toolbar className="justify-content-between">
          <div className={classes.wrapper}>
            <Typography className="align-self-center" variant="h6" color="inherit">
              {repository.owner + '/' + repository.name}
            </Typography>
            {repositoryAction}
          </div>
          <div>
            {repositoryMetrics}
            {repositoryLinkButton}
            {repositorySettings}
          </div>
        </Toolbar>
        {buildsChart}
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
