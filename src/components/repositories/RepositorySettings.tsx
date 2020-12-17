import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import {graphql} from 'babel-plugin-relay/macro';
import React from 'react';
import {commitMutation, createFragmentContainer} from 'react-relay';
import environment from '../../createRelayEnvironment';
import {RepositorySettings_repository} from './__generated__/RepositorySettings_repository.graphql';
import {
  ConfigResolutionStrategy, DecryptEnvironmentVariablesFor,
  RepositorySettingsInput,
  RepositorySettingsMutationResponse
} from './__generated__/RepositorySettingsMutation.graphql';
import {
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import {AddCircle} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";

const saveSettingsMutation = graphql`
  mutation RepositorySettingsMutation($input: RepositorySettingsInput!) {
    saveSettings(input: $input) {
      settings {
        needsApproval
        decryptEnvironmentVariables
        configResolutionStrategy
        additionalEnvironment
      }
    }
  }
`;

interface Props {
  repository: RepositorySettings_repository;
}

interface State {
  needsApproval?: boolean;
  decryptEnvironmentVariables?: DecryptEnvironmentVariablesFor;
  configResolutionStrategy: ConfigResolutionStrategy;
  additionalEnvironment: readonly string[]
  additionalEnvironmentToAdd?: string;
}

class RepositorySettings extends React.Component<Props, State> {
  initialSettings: State;

  constructor(props) {
    super(props);
    this.state = {
      ...props.repository.settings,
      additionalEnvironmentToAdd: ""
    };
    this.initialSettings = props.repository.settings;
    this.onSave = this.onSave.bind(this);
  }

  handleChange = (field: keyof State) => {
    return event => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };


  changeField = (field: keyof State) => {
    return event => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  toggleField = (field: keyof State) => {
    return event => {
      this.setState(prevState => ({
        ...prevState,
        [field]: !prevState[field],
      }));
    };
  };

  addNewEnvVariable = () => {
    this.setState(prevState => ({
      ...prevState,
      additionalEnvironment: (prevState.additionalEnvironment || []).concat(prevState.additionalEnvironmentToAdd),
      additionalEnvironmentToAdd: ""
    }));
  };

  deleteEnv = (line) => {
    this.setState(prevState => ({
      ...prevState,
      additionalEnvironment: (prevState.additionalEnvironment || []).filter((value) => line !== value),
    }));
  };

  render() {
    let areSettingsTheSame =
      this.state.needsApproval === this.initialSettings.needsApproval &&
      this.state.configResolutionStrategy === this.initialSettings.configResolutionStrategy &&
      JSON.stringify(this.state.additionalEnvironment) === JSON.stringify(this.initialSettings.additionalEnvironment) &&
      this.state.decryptEnvironmentVariables === this.initialSettings.decryptEnvironmentVariables;
    return (
      <Card>
        <CardContent>
          <FormControl style={{width: '100%'}}>
            <FormControlLabel
              control={<Switch checked={this.state.needsApproval} onChange={this.toggleField('needsApproval')}/>}
              label="Require approval for builds from users without write permissions"
            />
          </FormControl>
          <FormControl style={{width: '100%'}}>
            <FormHelperText>Decrypt Secured Environment Variables for builds initialized by:</FormHelperText>
            <Select
              value={this.state.decryptEnvironmentVariables}
              onChange={this.changeField('decryptEnvironmentVariables')}
              style={{width: '100%'}}
            >
              <MenuItem value={'EVERYONE'}>Everyone</MenuItem>
              <MenuItem value={'USERS_WITH_WRITE_PERMISSIONS'}>Only users with write permissions</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{width: '100%'}}>
            <FormHelperText>Config resolution strategy:</FormHelperText>
            <Select
              value={this.state.configResolutionStrategy}
              onChange={this.changeField('configResolutionStrategy')}
              style={{width: '100%'}}
            >
              <MenuItem value={'SAME_SHA'}>Same SHA</MenuItem>
              <MenuItem value={'MERGE_FOR_PRS'}>Merge for PRs</MenuItem>
              <MenuItem value={'DEFAULT_BRANCH'}>Latest from default branch</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{width: '100%'}}>
            <FormHelperText>Environment variable overrides</FormHelperText>
            <List>
              {this.state.additionalEnvironment.map((line) =>
                <ListItem key={line}>
                  <ListItemText primary={line}/>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete"
                                onClick={() => this.deleteEnv(line)}>
                      <DeleteIcon/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </FormControl>
          <FormControl style={{width: '100%'}}>
            <InputLabel htmlFor="override-env-var">New Environment Variable Override</InputLabel>
            <Input
              id="override-env-var"
              value={this.state.additionalEnvironmentToAdd}
              onChange={this.handleChange('additionalEnvironmentToAdd')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="add new env variable override"
                    onClick={this.addNewEnvVariable}>
                    <AddCircle/>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button variant="contained" disabled={areSettingsTheSame} onClick={() => this.onSave()}>
            Save
          </Button>
        </CardActions>
      </Card>
    );
  }

  onSave() {
    const input: RepositorySettingsInput = {
      clientMutationId: 'save-settings-' + this.props.repository.id,
      repositoryId: this.props.repository.id,
      needsApproval: this.state.needsApproval,
      decryptEnvironmentVariables: this.state.decryptEnvironmentVariables,
      configResolutionStrategy: this.state.configResolutionStrategy,
      additionalEnvironment: this.state.additionalEnvironment.concat(),
    };

    commitMutation(environment, {
      mutation: saveSettingsMutation,
      variables: {input},
      onCompleted: (response: RepositorySettingsMutationResponse) => {
        this.initialSettings = response.saveSettings.settings;
        this.forceUpdate();
      },
      onError: err => console.error(err),
    });
  }
}

export default createFragmentContainer(RepositorySettings, {
  repository: graphql`
    fragment RepositorySettings_repository on Repository {
      id
      settings {
        needsApproval
        decryptEnvironmentVariables
        configResolutionStrategy
        additionalEnvironment
      }
    }
  `,
});
