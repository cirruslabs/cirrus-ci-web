import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer,} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {withRouter} from 'react-router-dom'
import ReactMarkdown from 'react-markdown';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import BuildChangeChip from "./chips/BuildChangeChip";
import {navigateBuild} from "../utils/navigate";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core";
import classNames from 'classnames';
import {cirrusColors} from "../cirrusTheme";

let styles = {
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
      <Paper elevation={1}>
        <Toolbar className={classes.title}>
          <Typography variant="title" color="inherit">
            Recent Builds
          </Typography>
        </Toolbar>
        {buildsComponent}
      </Paper>
    );
  }

  buildItem(build) {
    let {classes} = this.props;
    return (
      <TableRow key={build.id}
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}}>
          <div className="d-flex flex-column align-items-start">
            <RepositoryNameChip repository={build.repository} className={classes.chip}/>
            <BuildBranchNameChip build={build} className={classes.chip}/>
            <BuildChangeChip build={build} className={classes.chip}/>
            <BuildStatusChip build={build} className={classNames("d-lg-none", classes.chip)}/>
          </div>
        </TableCell>
        <TableCell style={{width: '100%', maxWidth: 600}}>
          <div className="card-body">
            <ReactMarkdown className="card-text" source={build.changeMessageTitle}/>
          </div>
        </TableCell>
        <TableCell className="d-none d-lg-table-cell">
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
