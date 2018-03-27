import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'

import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table';
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import {navigateBuild} from "../utils/navigate";
import {Typography, withStyles} from "material-ui";

let styles = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
  message: {
    margin: theme.spacing.unit,
  },
});


class ViewerTopActiveRepositories extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    console.log(this.props);
    let repositories = this.props.viewer.topActiveRepositories;

    return (
      <Table style={{tableLayout: 'auto'}}>
        <TableBody>
          {repositories && repositories.map(repo => this.buildItem(repo))}
        </TableBody>
      </Table>
    );
  }

  buildItem(repository) {
    let {classes} = this.props;
    let build = repository.lastDefaultBranchBuild;
    return (
      <TableRow key={build.id}
                onClick={(e) => navigateBuild(this.context.router, e, build.id)}
                hover={true}
                style={{cursor: "pointer"}}>
        <TableCell style={{padding: 0}}>
          <div className="d-flex justify-content-between">
            <RepositoryNameChip repository={repository} className={classes.chip}/>
            <BuildStatusChip build={build} className={classes.chip}/>
          </div>
          <Typography className={classes.chip}
                      variant="subheading"
          >
            {build.changeMessageTitle}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(ViewerTopActiveRepositories)), {
  viewer: graphql`
    fragment ViewerTopActiveRepositories_repositories on User {
      topActiveRepositories {
        id
        owner
        name
        viewerPermission
        lastDefaultBranchBuild {
          id
          branch
          changeIdInRepo
          changeMessageTitle
          durationInSeconds
          status
          changeTimestamp
        }
      }
    }
  `,
});
