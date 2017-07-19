import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'

import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';


class RepositorySettingsView extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
    };

    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.repository.fullName + " settings"}/>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(RepositorySettingsView), {
  repository: graphql`
    fragment RepositorySettingsView_repository on Repository {
      fullName
    }
  `,
});
