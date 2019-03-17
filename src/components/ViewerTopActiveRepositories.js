import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer,} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {withRouter} from 'react-router-dom'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {withStyles} from "@material-ui/core";
import LastDefaultBranchBuildMiniRow from "./LastDefaultBranchBuildMiniRow";

let styles = theme => ({
  message: {
    margin: theme.spacing.unit,
  },
});


class ViewerTopActiveRepositories extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let repositories = this.props.viewer.topActiveRepositories || [];

    return (
      <Table style={{tableLayout: 'auto'}}>
        <TableBody>
          {repositories && repositories.map(repo => <LastDefaultBranchBuildMiniRow key={repo.id} repository={repo}/>)}
        </TableBody>
      </Table>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(ViewerTopActiveRepositories)), {
  viewer: graphql`
    fragment ViewerTopActiveRepositories_viewer on User {
      topActiveRepositories {
        ...LastDefaultBranchBuildMiniRow_repository
      }
    }
  `,
});
