import PropTypes from 'prop-types';
import React from 'react';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RepositorySecuredVariables from "./RepositorySecuredVariables";
import RepositorySettings from "./RepositorySettings";
import {createFragmentContainer, graphql} from "react-relay";

class RepositorySettingsPage extends React.Component {
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

    let repository = this.props.repository;
    console.log(repository);
    return (
      <div style={styles.main} className="container">
        <Paper style={styles.settingItem} zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={repository.owner + "/" + repository.name + " repository settings"}/>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <div style={styles.settingGap}/>
        <Paper zDepth={1} rounded={false}>
          <RepositorySettings {...this.props}/>
        </Paper>
        <div style={styles.settingGap}/>
        <Paper zDepth={1} rounded={false}>
          <RepositorySecuredVariables {...this.props}/>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(RepositorySettingsPage, {
  repository: graphql`
    fragment RepositorySettingsPage_repository on Repository {
      owner
      name
      ...RepositorySecuredVariables_repository
      ...RepositorySettings_repository      
    }
  `,
});
