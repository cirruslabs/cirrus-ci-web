import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import BuildDurationsChart from '../builds/BuildDurationsChart';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import { navigateBuild } from '../../utils/navigate';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import classNames from 'classnames';
import CreateBuildDialog from '../builds/CreateBuildDialog';
import { RepositoryBuildList_repository } from './__generated__/RepositoryBuildList_repository.graphql';
import { NodeOfConnection } from '../../utils/utility-types';
import { createLinkToRepository } from '../../utils/github';
import { Helmet as Head } from 'react-helmet';
import Settings from '@material-ui/icons/Settings';
import AddCircle from '@material-ui/icons/AddCircle';
import Timeline from '@material-ui/icons/Timeline';

let styles = createStyles({
  gap: {
    paddingTop: 16,
  },
  chip: {
    margin: 4,
  },
  cell: {
    padding: 0,
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
});

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  branch?: string;
  repository: RepositoryBuildList_repository;
}

interface State {
  selectedBuildId?: string;
  openCreateDialog: boolean;
}

class RepositoryBuildList extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedBuildId: null,
      openCreateDialog: false,
    };
  }

  render() {
    let { repository, classes } = this.props;
    let builds = repository.builds.edges.map(edge => edge.node, styles);

    let repositorySettings = null;
    let repositoryAction = null;
    if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
      repositorySettings = (
        <Tooltip title="Repository Settings">
          <a href={'/settings/repository/' + repository.id}>
            <IconButton>
              <Settings />
            </IconButton>
          </a>
        </Tooltip>
      );
      repositoryAction = (
        <>
          <div key="create-build-gap" className={classes.horizontalGap} />
          <Tooltip title="Create Build">
            <IconButton
              key="create-build-button"
              onClick={() => this.setState(prevState => ({ ...prevState, openCreateDialog: true }))}
            >
              <AddCircle />
            </IconButton>
          </Tooltip>
        </>
      );
    }

    let repositoryMetrics = (
      <a href={'/metrics/repository/' + repository.owner + '/' + repository.name}>
        <Tooltip title="Repository Metrics">
          <IconButton>
            <Timeline />
          </IconButton>
        </Tooltip>
      </a>
    );

    const repositoryLinkButton = (
      <Tooltip title="Open on GitHub">
        <a href={createLinkToRepository(repository, this.props.branch)} target="_blank" rel="noopener noreferrer">
          <IconButton>
            <GitHubIcon />
          </IconButton>
        </a>
      </Tooltip>
    );

    let buildsChart = null;

    if (this.props.branch && builds.length > 5) {
      buildsChart = (
        <Paper elevation={1} className={classes.buildsChart}>
          <BuildDurationsChart
            builds={builds.slice().reverse()}
            selectedBuildId={this.state.selectedBuildId}
            onSelectBuildId={buildId => this.setState({ selectedBuildId: buildId })}
          />
        </Paper>
      );
    }

    return (
      <div>
        <Head>
          <title>
            {repository.owner}/{repository.name} - Cirrus CI
          </title>
        </Head>
        <Paper elevation={1}>
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
        </Paper>
        {this.state.openCreateDialog && (
          <CreateBuildDialog
            repository={repository}
            open={this.state.openCreateDialog}
            onClose={() => this.setState(prevState => ({ ...prevState, openCreateDialog: false }))}
          />
        )}
        {buildsChart}
        <div className={classes.gap} />
        <Paper elevation={1}>
          <Table style={{ tableLayout: 'auto' }}>
            <TableBody>{builds.map(build => this.buildItem(build))}</TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build: NodeOfConnection<RepositoryBuildList_repository['builds']>) {
    let { classes } = this.props;
    let isSelectedBuild = this.state.selectedBuildId === build.id;
    return (
      <TableRow
        key={build.id}
        hover={true}
        selected={isSelectedBuild}
        onMouseOver={() => !isSelectedBuild && this.setState({ selectedBuildId: build.id })}
        onClick={e => navigateBuild(this.context.router, e, build.id)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell style={{ padding: 0 }}>
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
}

export default createFragmentContainer(withStyles(styles)(withRouter(RepositoryBuildList)), {
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
