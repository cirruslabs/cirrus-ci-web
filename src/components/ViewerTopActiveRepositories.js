import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'

import Table, {TableBody} from 'material-ui/Table';
import {withStyles} from "material-ui";
import LastDefaultBranchBuildRow from "./LastDefaultBranchBuildRow";

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
          {repositories && repositories.map(repo => <LastDefaultBranchBuildRow repository={repo}/>)}
        </TableBody>
      </Table>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(ViewerTopActiveRepositories)), {
  viewer: graphql`
    fragment ViewerTopActiveRepositories_viewer on User {
      topActiveRepositories {
        ...LastDefaultBranchBuildRow_repository
      }
    }
  `,
});
