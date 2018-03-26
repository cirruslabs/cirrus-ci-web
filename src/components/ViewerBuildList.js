import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'
import ReactMarkdown from 'react-markdown';

import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import BuildChangeChip from "./chips/BuildChangeChip";
import {navigateBuild} from "../utils/navigate";
import {Typography, withStyles} from "material-ui";
import classNames from 'classnames';
import {cirrusColors} from "../cirrusTheme";

let styles = {
  main: {
    paddingTop: 8
  },
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  chip: {
    margin: 4,
  },
  emptyBuilds: {
    margin: 8,
  },
};


class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {classes} = this.props;
    let builds = this.props.viewer.builds;

    let buildsComponent = (
      <Table style={{tableLayout: 'auto'}}>
        <TableBody>
          {builds && builds.edges.map(edge => this.buildItem(edge.node))}
        </TableBody>
      </Table>
    );
    if (!builds || builds.edges.length === 0) {
      buildsComponent = (
        <div className={classes.emptyBuilds}>
          <ReactMarkdown
            source="No recent builds! Please check [documentation](https://cirrus-ci.org/) on how to start with Cirrus CI."/>
        </div>
      );
    }
    return (
      <div className={classNames("container", classes.main)}>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="title" color="inherit">
              Recent Builds
            </Typography>
          </Toolbar>
          {buildsComponent}
        </Paper>
      </div>
    );
  }

  buildItem(build) {
    let {classes} = this.props;
    return (
      <TableRow key={build.id}
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}} className="d-flex flex-column align-items-start">
          <RepositoryNameChip repository={build.repository} className={classes.chip}/>
          <BuildBranchNameChip build={build} className={classes.chip}/>
          <BuildChangeChip build={build} className={classes.chip}/>
          <BuildStatusChip build={build} className={classNames("hidden-lg-up", classes.chip)}/>
        </TableCell>
        <TableCell style={{width: '100%', maxWidth: 600}}>
          <div className="card-block">
            <ReactMarkdown className="card-text" source={build.changeMessageTitle}/>
          </div>
        </TableCell>
        <TableCell style={{padding: 0}} className="hidden-md-down">
          <BuildStatusChip build={build} className={classes.chip}/>
        </TableCell>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(ViewerBuildList)), {
  viewer: graphql`
    fragment ViewerBuildList_viewer on User {
      builds(last: 100) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessageTitle
            durationInSeconds
            status
            changeTimestamp
            repository {
              owner
              name
            }
          }
        }
      }
    }
  `,
});
