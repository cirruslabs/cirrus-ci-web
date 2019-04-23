import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {Link, withRouter} from 'react-router-dom'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import BuildDurationsChart from "./BuildDurationsChart";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import BuildChangeChip from "./chips/BuildChangeChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import {navigateBuild} from "../utils/navigate";
import {withStyles} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import classNames from 'classnames';

let styles = {
  gap: {
    paddingTop: 16
  },
  chip: {
    margin: 4,
  },
  cell: {
    padding: 0,
    width: "100%",
    maxWidth: "600",
  },
  buildsChart: {
    height: 150,
  },
};

class RepositoryBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object
  };

  constructor() {
    super();
    this.state = {selectedBuildId: "0"};
  }

  render() {
    let {repository, classes} = this.props;
    let builds = repository.builds.edges.map(edge => edge.node, styles);

    let repositorySettings = null;

    if (repository.viewerPermission === 'WRITE' || repository.viewerPermission === 'ADMIN') {
      repositorySettings = (
        <Link to={"/settings/repository/" + repository.id}>
          <IconButton tooltip="Repository Settings">
            <Icon>settings</Icon>
          </IconButton>
        </Link>
      );
    }

    let buildsChart = null;

    if (this.props.branch && builds.length > 5) {
      buildsChart = (
        <Paper elevation={1} className={classes.buildsChart}>
          <BuildDurationsChart builds={builds.slice().reverse()}
                               selectedBuildId={this.state.selectedBuildId}
                               onSelectBuildId={(buildId) => this.setState({selectedBuildId: buildId})}/>
        </Paper>
      );
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className="justify-content-between">
            <Typography variant="h6" color="inherit">
              {repository.owner + "/" + repository.name}
            </Typography>
            {repositorySettings}
          </Toolbar>
        </Paper>
        {buildsChart}
        <div className={classes.gap}/>
        <Paper elevation={1}>
          <Table style={{tableLayout: 'auto'}}>
            <TableBody>
              {builds.map(build => this.buildItem(build))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build) {
    let {classes} = this.props;
    let isSelectedBuild = this.state.selectedBuildId === build.id;
    return (
      <TableRow key={build.id}
                hover={true}
                selected={isSelectedBuild}
                onMouseOver={() => (!isSelectedBuild) && this.setState({selectedBuildId: build.id})}
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}}>
          <div className="d-flex flex-column align-items-start">
            <BuildBranchNameChip build={build} className={classes.chip}/>
            <BuildChangeChip build={build} className={classes.chip}/>
            <BuildStatusChip build={build} className={classNames("d-lg-none", classes.chip)}/>
          </div>
        </TableCell>
        <TableCell className={classes.cell}>
          <div className="card-body">
            <Typography variant="h6" color="inherit">
              {build.changeMessageTitle}
            </Typography>
          </div>
        </TableCell>
        <TableCell className={classNames("d-none", "d-lg-table-cell", classes.cell)}>
          <BuildStatusChip build={build} className={classes.chip}/>
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
