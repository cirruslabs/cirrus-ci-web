import { withStyles, WithStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import LastDefaultBranchBuildMiniRow from '../builds/LastDefaultBranchBuildMiniRow';
import { ViewerTopActiveRepositories_viewer } from './__generated__/ViewerTopActiveRepositories_viewer.graphql';

let styles = theme => ({
  message: {
    margin: theme.spacing(1.0),
  },
});

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  viewer: ViewerTopActiveRepositories_viewer;
}

class ViewerTopActiveRepositories extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let repositories = this.props.viewer.topActiveRepositories || [];

    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {repositories && repositories.map(repo => <LastDefaultBranchBuildMiniRow key={repo.id} repository={repo} />)}
        </TableBody>
      </Table>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(ViewerTopActiveRepositories)), {
  viewer: graphql`
    fragment ViewerTopActiveRepositories_viewer on User {
      topActiveRepositories {
        id
        ...LastDefaultBranchBuildMiniRow_repository
      }
    }
  `,
});
