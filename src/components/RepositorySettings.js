import React from 'react';
import {commitMutation, createFragmentContainer, graphql} from 'react-relay';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
  withStyles
} from "material-ui";
import environment from "../createRelayEnvironment";

const saveSettingsMutation = graphql`
  mutation RepositorySettingsMutation(
    $input: RepositorySettingsInput!
  ) {
    saveSettings(input: $input) {
      settings {
        needsApproval
        decryptEnvironmentVariables
      }
    }
  }
`;

class RepositorySettings extends React.Component {
  constructor(props) {
    super();
    this.state = props.repository.settings;
    this.initialSettings = props.repository.settings;
    this.toggleNeedsApproval = this.toggleNeedsApproval.bind(this);
    this.handleDecryptEnvironmentVariablesChange = this.handleDecryptEnvironmentVariablesChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  toggleNeedsApproval(event, isInputChecked) {
    this.setState(() => ({
      needsApproval: isInputChecked
    }))
  }

  handleDecryptEnvironmentVariablesChange(event) {
    this.setState(() => ({
      decryptEnvironmentVariables: event.target.value
    }))
  }

  render() {
    let areSettingsTheSame =
      this.state.needsApproval === this.initialSettings.needsApproval &&
      this.state.decryptEnvironmentVariables === this.initialSettings.decryptEnvironmentVariables;
    return (
      <Card>
        <CardHeader title="Security Preferences"/>
        <CardContent>
          <FormControl style={{width: "100%"}}>
            <FormControlLabel
              control={
                <Switch checked={this.state.needsApproval}
                        onChange={this.toggleNeedsApproval}
                />
              }
              label="Require approval for builds from users without write permissions"
            />
          </FormControl>
          <FormControl style={{width: "100%"}}>
            <FormHelperText>Decrypt Secured Environment Variables for builds initialized by:</FormHelperText>
            <Select
              value={this.state.decryptEnvironmentVariables}
              onChange={this.handleDecryptEnvironmentVariablesChange}
              style={{width: '100%'}}
            >
              <MenuItem value={'EVERYONE'}>Everyone</MenuItem>
              <MenuItem value={'USERS_WITH_WRITE_PERMISSIONS'}>Only users with write permissions</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button variant="raised"
                  color="primary"
                  disabled={areSettingsTheSame}
                  onTouchTap={() => this.onSave()}
          >Save</Button>
        </CardActions>
      </Card>
    );
  }

  onSave() {
    const variables = {
      input: {
        clientMutationId: "save-settings-" + this.props.repository.id,
        repositoryId: this.props.repository.id,
        needsApproval: this.state.needsApproval,
        decryptEnvironmentVariables: this.state.decryptEnvironmentVariables,
      },
    };

    commitMutation(
      environment,
      {
        mutation: saveSettingsMutation,
        variables: variables,
        onCompleted: (response) => {
          this.initialSettings = response.saveSettings.settings;
          this.forceUpdate()
        },
        onError: err => console.error(err),
      },
    );
  }
}

export default createFragmentContainer(withStyles()(RepositorySettings), {
  repository: graphql`
    fragment RepositorySettings_repository on Repository {
      id
      settings {
        needsApproval
        decryptEnvironmentVariables
      }
    }
  `,
});
