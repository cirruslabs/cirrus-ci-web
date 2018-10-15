import React from 'react';
import environment from '../../createRelayEnvironment';
import {commitMutation, createFragmentContainer, graphql} from 'react-relay';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import {withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";

const securedVariableMutation = graphql`
  mutation WebHookSettingsMutation($input: SaveWebHookSettingsInput!) {
    saveWebHookSettings(input: $input) {
      error
      info {
        webhookSettings {
          webhookURL
        }
      }
    }
  }
`;

const styles = theme => ({});

class WebHookSettings extends React.Component {
  constructor(props) {
    super(props);
    let initialURL = props.info.webhookSettings.webhookURL || "";
    this.state = {
      initialURL: initialURL,
      inputValue: initialURL
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let inputValue = event.target.value;
    this.setState(prevState => ({
      ...prevState,
      inputValue: inputValue
    }));
  }

  render() {
    return (
      <Card>
        <CardHeader title="WebHook Settings"/>
        <CardContent>
          <FormControl style={{width: "100%"}}>
            <TextField
              name="webhookURL"
              placeholder="Enter webhook URL"
              value={this.state.inputValue}
              onChange={this.handleChange}
              fullWidth={true}/>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button variant="raised"
                  color="primary"
                  disabled={this.state.inputValue === this.state.initialURL}
                  onClick={() => this.saveWebHookURL()}>Save</Button>
        </CardActions>
      </Card>
    );
  }

  saveWebHookURL() {
    let webhookURL = this.state.inputValue;
    const variables = {
      input: {
        clientMutationId: webhookURL,
        accountId: this.props.info.id,
        webhookURL: webhookURL,
      },
    };

    commitMutation(
      environment,
      {
        mutation: securedVariableMutation,
        variables: variables,
        onCompleted: (response) => {
          let settings = response.saveWebHookSettings.info;
          let savedWebhookURL = settings.webhookSettings.webhookURL;
          this.setState(prevState => ({
            ...prevState,
            initialURL: savedWebhookURL,
            inputValue: savedWebhookURL,
          }));
        },
        onError: err => console.error(err),
      },
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(WebHookSettings)), {
  info: graphql`
    fragment WebHookSettings_info on GitHubOrganizationInfo {
      id
      webhookSettings {
        webhookURL
      }
    }
  `,
});
