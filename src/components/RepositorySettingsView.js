import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import {withRouter} from 'react-router-dom'
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RepositorySecuredVariables from "./RepositorySecuredVariables";

class RepositorySettingsView extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      settingGap: {
        paddingTop: 16
      },
    };

    return (
      <div style={styles.main} className="container">
        <Paper style={styles.settingItem} zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.repository.owner + "/" + this.props.repository.name + " repository settings"}/>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <div style={styles.settingGap}/>
        <Paper zDepth={1} rounded={false}>
          <RepositorySecuredVariables repository={this.props.repository}/>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(RepositorySettingsView), {
  repository: graphql`
    fragment RepositorySettingsView_repository on Repository {
      id
      owner
      name
    }
  `,
});
