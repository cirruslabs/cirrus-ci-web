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
import { graphql } from 'babel-plugin-relay/macro';
import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { RepositorySettings_repository } from './__generated__/RepositorySettings_repository.graphql';
import {
  RepositorySettingsInput,
  RepositorySettingsMutationResponse,
} from './__generated__/RepositorySettingsMutation.graphql';
import {
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';

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

function RepositorySettings(props: Props) {
  let [initialSettings, setInitialSettings] = useState(props.repository.settings);
  let [settings, setSettings] = useState(props.repository.settings);
  let [additionalEnvironmentToAdd, setAdditionalEnvironmentToAdd] = useState('');

  let changeField = field => {
    return event => {
      let value = event.target.value;
      setSettings({
        ...settings,
        [field]: value,
      });
    };
  };

  let toggleField = field => {
    return event => {
      setSettings({
        ...settings,
        [field]: !settings[field],
      });
    };
  };

  let addNewEnvVariable = () => {
    setAdditionalEnvironmentToAdd('');
    setSettings({
      ...settings,
      additionalEnvironment: (settings.additionalEnvironment || []).concat(additionalEnvironmentToAdd),
    });
  };

  let deleteEnv = line => {
    setSettings({
      ...settings,
      additionalEnvironment: (settings.additionalEnvironment || []).filter(value => line !== value),
    });
  };

  function onSave() {
    const input: RepositorySettingsInput = {
      clientMutationId: 'save-settings-' + props.repository.id,
      repositoryId: props.repository.id,
      needsApproval: settings.needsApproval,
      decryptEnvironmentVariables: settings.decryptEnvironmentVariables,
      configResolutionStrategy: settings.configResolutionStrategy,
      additionalEnvironment: settings.additionalEnvironment.concat(),
    };

    commitMutation(environment, {
      mutation: saveSettingsMutation,
      variables: { input },
      onCompleted: (response: RepositorySettingsMutationResponse) => {
        setInitialSettings(response.saveSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  let areSettingsTheSame =
    settings.needsApproval === initialSettings.needsApproval &&
    settings.configResolutionStrategy === initialSettings.configResolutionStrategy &&
    JSON.stringify(settings.additionalEnvironment) === JSON.stringify(initialSettings.additionalEnvironment) &&
    settings.decryptEnvironmentVariables === initialSettings.decryptEnvironmentVariables;
  return (
    <Card>
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <FormControlLabel
            control={<Switch checked={settings.needsApproval} onChange={toggleField('needsApproval')} />}
            label="Require approval for builds from users without write permissions"
          />
        </FormControl>
        <FormControl style={{ width: '100%' }}>
          <FormHelperText>Decrypt Secured Environment Variables for builds initialized by:</FormHelperText>
          <Select
            value={settings.decryptEnvironmentVariables}
            onChange={changeField('decryptEnvironmentVariables')}
            style={{ width: '100%' }}
          >
            <MenuItem value={'EVERYONE'}>Everyone</MenuItem>
            <MenuItem value={'USERS_WITH_WRITE_PERMISSIONS'}>Only users with write permissions</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '100%' }}>
          <FormHelperText>Config resolution strategy:</FormHelperText>
          <Select
            value={settings.configResolutionStrategy}
            onChange={changeField('configResolutionStrategy')}
            style={{ width: '100%' }}
          >
            <MenuItem value={'SAME_SHA'}>Same SHA</MenuItem>
            <MenuItem value={'MERGE_FOR_PRS'}>Merge for PRs</MenuItem>
            <MenuItem value={'DEFAULT_BRANCH'}>Latest from default branch</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '100%' }}>
          <FormHelperText>Environment variable overrides</FormHelperText>
          <List>
            {settings.additionalEnvironment.map(line => (
              <ListItem key={line}>
                <ListItemText primary={line} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteEnv(line)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </FormControl>
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor="override-env-var">New Environment Variable Override</InputLabel>
          <Input
            id="override-env-var"
            value={additionalEnvironmentToAdd}
            onChange={event => setAdditionalEnvironmentToAdd(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="add new env variable override" onClick={addNewEnvVariable}>
                  <AddCircle />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </CardContent>
      <CardActions>
        <Button variant="contained" disabled={areSettingsTheSame} onClick={() => onSave()}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
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
