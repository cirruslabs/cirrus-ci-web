import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BuildDurationsChart from './BuildDurationsChart';
import BuildBranchNameChip from './chips/BuildBranchNameChip';
import BuildChangeChip from './chips/BuildChangeChip';
import BuildStatusChip from './chips/BuildStatusChip';
import { navigateBuild } from '../utils/navigate';
import { withStyles, WithStyles, createStyles, Tooltip } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';
import CreateBuildDialog from './CreateBuildDialog';
import { RepositoryBuildList_repository } from './__generated__/RepositoryBuildList_repository.graphql';

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
  selectedBuildId: number;
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
      selectedBuildId: 0,
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
          <Link to={'/settings/repository/' + repository.id}>
            <IconButton>
              <Icon>settings</Icon>
            </IconButton>
          </Link>
        </Tooltip>
      );
      repositoryAction = [
        <div key="create-build-gap" className={classes.horizontalGap} />,
        <Tooltip title="Create Build">
          <IconButton
            key="create-build-button"
            onClick={() => this.setState(prevState => ({ ...prevState, openCreateDialog: true }))}
          >
            <Icon>add_circle</Icon>
          </IconButton>
        </Tooltip>,
      ];
    }

    let repositoryMetrics = (
      <Link to={'/metrics/repository/' + repository.owner + '/' + repository.name}>
        <Tooltip title="Repository Metrics">
          <IconButton>
            <Icon>timeline</Icon>
          </IconButton>
        </Tooltip>
      </Link>
    );

    const repositoryLink = (
      <Tooltip title="Open in GitHub">
        <IconButton href={repoToLink(repository, this.props.branch)} target="_blank" rel="noopener noreferrer">
          <Icon className={classNames('fa', 'fa-github')} />
        </IconButton>
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
              {repositoryLink}
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

  buildItem(build) {
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

export default createFragmentContainer(withRouter(withStyles(styles)(RepositoryBuildList)), {
  repository: graphql`
    fragment RepositoryBuildList_repository on Repository {
      id
      owner
      name
      viewerPermission
      ...CreateBuildDialog_repository
      builds(last: 100, branch: $branch) {
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
