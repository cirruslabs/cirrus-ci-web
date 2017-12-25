import React from 'react';
import {commitMutation, createFragmentContainer, graphql} from 'react-relay';
import RaisedButton from 'material-ui/RaisedButton';
import {MenuItem, SelectField, Toggle} from "material-ui";
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

  handleDecryptEnvironmentVariablesChange(event, key, payload) {
    this.setState(() => ({
      decryptEnvironmentVariables: payload
    }))
  }

  render() {
    let areSettingsTheSame =
      this.state.needsApproval === this.initialSettings.needsApproval &&
      this.state.decryptEnvironmentVariables === this.initialSettings.decryptEnvironmentVariables;
    return (
      <div className="card-block">
        <div className="card-body">
          <Toggle label="Require approval for builds from users without write permissions"
                  toggled={this.state.needsApproval}
                  onToggle={this.toggleNeedsApproval}
          />
          <SelectField
            floatingLabelText="Decrypt Secured Environment Variables for builds initialized by:"
            value={this.state.decryptEnvironmentVariables}
            onChange={this.handleDecryptEnvironmentVariablesChange}
            style={{width: '100%'}}
          >
            <MenuItem value={'EVERYONE'} primaryText="Everyone" />
            <MenuItem value={'USERS_WITH_WRITE_PERMISSIONS'} primaryText="Only users with write permissions" />
          </SelectField>
        </div>
        <div className="card-body text-right">
          <RaisedButton label="Save"
                        disabled={areSettingsTheSame}
                        primary={true}
                        onTouchTap={() => this.onSave()}
          />
        </div>
      </div>
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

    console.log(variables.input);

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

export default createFragmentContainer(RepositorySettings, {
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
