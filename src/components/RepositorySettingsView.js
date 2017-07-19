import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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
      settingGap: {
        paddingTop: 16
      },
      securedVariableTitle: {
        verticalAlign: "middle"
      },
    };

    return (
      <div style={styles.main} className="container">
        <Paper style={styles.settingItem} zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={this.props.repository.fullName + " repository settings"}/>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <div style={styles.settingGap}/>
        <Paper zDepth={1} rounded={false}>
          <Card>
            <CardHeader
              title="Secured Variables"
              titleStyle={styles.securedVariableTitle}
              actAsExpander={true}
              showExpandableButton={true}
              avatar={<FontIcon className="material-icons">lock</FontIcon>}
            />
            <CardText expandable={true}>
              <TextField
                hintText="Enter value to create a secure variable for"
                multiLine={true}
                fullWidth={true}/>
            </CardText>
            <CardActions expandable={true}>
              <RaisedButton primary={true} label="Encrypt"/>
            </CardActions>
          </Card>
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
