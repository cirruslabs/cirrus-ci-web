import React, { useState } from 'react';
import { useFragment, useMutation } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { AddCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Checkbox,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

import {
  RepositorySettingsMutation,
  RepositorySettingsMutation$data,
  RepositorySettingsMutation$variables,
} from './__generated__/RepositorySettingsMutation.graphql';
import { RepositorySettings_repository$key } from './__generated__/RepositorySettings_repository.graphql';

interface Props {
  repository: RepositorySettings_repository$key;
}

export default function RepositorySettings(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositorySettings_repository on Repository {
        id
        settings {
          needsApproval
          decryptEnvironmentVariables
          configResolutionStrategy
          additionalEnvironment
          cacheVersion
          oidcSubIncludeClaimKeys
        }
      }
    `,
    props.repository,
  );

  let [initialSettings, setInitialSettings] = useState(repository.settings);
  let [settings, setSettings] = useState(repository.settings);
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

  let setClearCaches = (event, checked) => {
    const cacheVersion = checked ? initialSettings.cacheVersion + 1 : initialSettings.cacheVersion;

    setSettings({
      ...settings,
      cacheVersion: cacheVersion,
    });
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

  const [commitSaveSettingsMutation] = useMutation<RepositorySettingsMutation>(graphql`
    mutation RepositorySettingsMutation($input: RepositorySettingsInput!) {
      saveSettings(input: $input) {
        settings {
          needsApproval
          decryptEnvironmentVariables
          configResolutionStrategy
          additionalEnvironment
          cacheVersion
          oidcSubIncludeClaimKeys
        }
      }
    }
  `);

  function onSave() {
    const variables: RepositorySettingsMutation$variables = {
      input: {
        clientMutationId: 'save-settings-' + repository.id,
        repositoryId: repository.id,
        needsApproval: settings.needsApproval,
        decryptEnvironmentVariables: settings.decryptEnvironmentVariables,
        configResolutionStrategy: settings.configResolutionStrategy,
        additionalEnvironment: settings.additionalEnvironment.concat(),
        cacheVersion: settings.cacheVersion,
        oidcSubIncludeClaimKeys: settings.oidcSubIncludeClaimKeys.concat(),
      },
    };

    commitSaveSettingsMutation({
      variables: variables,
      onCompleted: (response: RepositorySettingsMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setInitialSettings(response.saveSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  let areSettingsTheSame =
    settings.needsApproval === initialSettings.needsApproval &&
    settings.configResolutionStrategy === initialSettings.configResolutionStrategy &&
    JSON.stringify(settings.additionalEnvironment) === JSON.stringify(initialSettings.additionalEnvironment) &&
    JSON.stringify(settings.oidcSubIncludeClaimKeys) === JSON.stringify(initialSettings.oidcSubIncludeClaimKeys) &&
    settings.decryptEnvironmentVariables === initialSettings.decryptEnvironmentVariables &&
    settings.cacheVersion === initialSettings.cacheVersion;
  return (
    <Card elevation={24}>
      <CardContent>
        <FormControl fullWidth variant="standard">
          <FormControlLabel
            control={<Switch checked={settings.needsApproval} onChange={toggleField('needsApproval')} />}
            label="Require approval for builds from users without write permissions"
          />
        </FormControl>
        <FormControl fullWidth variant="standard">
          <FormHelperText>Decrypt Secured Environment Variables for builds initialized by:</FormHelperText>
          <Select
            value={settings.decryptEnvironmentVariables}
            onChange={changeField('decryptEnvironmentVariables')}
            fullWidth
            variant="standard"
          >
            <MenuItem value={'USERS_WITH_WRITE_PERMISSIONS'}>Only users with write permissions</MenuItem>
            <MenuItem value={'COLLABORATORS'}>Collaborators, bots and users with write permissions</MenuItem>
            <MenuItem value={'EVERYONE'}>Everyone</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="standard">
          <FormHelperText>Config resolution strategy:</FormHelperText>
          <Select
            value={settings.configResolutionStrategy}
            onChange={changeField('configResolutionStrategy')}
            fullWidth
            variant="standard"
          >
            <MenuItem value={'SAME_SHA'}>Same SHA</MenuItem>
            <MenuItem value={'MERGE_FOR_PRS'}>Merge for PRs</MenuItem>
            <MenuItem value={'DEFAULT_BRANCH'}>Latest from default branch</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="standard">
          <InputLabel htmlFor="oidc-sub-extra-claims">
            Extra claims to include in the OIDC sub claim (comma separated). For example, "branch,user_permission".
          </InputLabel>
          <Input
            id="oidc-sub-extra-claims"
            value={settings.oidcSubIncludeClaimKeys.join(',')}
            onChange={event =>
              setSettings({
                ...settings,
                oidcSubIncludeClaimKeys: event.target.value.split(','),
              })
            }
          />
        </FormControl>
        {settings.additionalEnvironment.length > 0 && (
          <FormControl fullWidth variant="standard">
            <FormHelperText>Environment variable overrides</FormHelperText>
            <List>
              {settings.additionalEnvironment.map(line => (
                <ListItem key={line}>
                  <ListItemText primary={line} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteEnv(line)} size="large">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </FormControl>
        )}
        <FormControl fullWidth variant="standard">
          <InputLabel htmlFor="override-env-var">
            New Environment Variable Override (FOO=Bar or FOO=ENCRYPTED[...])
          </InputLabel>
          <Input
            id="override-env-var"
            value={additionalEnvironmentToAdd}
            onChange={event => setAdditionalEnvironmentToAdd(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="add new env variable override" onClick={addNewEnvVariable} size="large">
                  <AddCircle />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth variant="standard">
          <FormControlLabel
            control={
              <Checkbox checked={initialSettings.cacheVersion !== settings.cacheVersion} onChange={setClearCaches} />
            }
            label="Clear all repository caches"
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
