import React, { useState } from 'react';
import { useFragment, useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import { Add, Delete } from '@mui/icons-material';
import { CardActions } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';

import BuildStatusChip from 'components/chips/BuildStatusChip';
import NextCronInvocationTimeChip from 'components/chips/NextCronInvocationTimeChip';
import { navigateBuildHelper } from 'utils/navigateHelper';

import {
  RepositoryCronSettingsRemoveMutation,
  RepositoryCronSettingsRemoveMutation$data,
  RepositoryCronSettingsRemoveMutation$variables,
} from './__generated__/RepositoryCronSettingsRemoveMutation.graphql';
import {
  RepositoryCronSettingsSaveMutation,
  RepositoryCronSettingsSaveMutation$data,
  RepositoryCronSettingsSaveMutation$variables,
} from './__generated__/RepositoryCronSettingsSaveMutation.graphql';
import { RepositoryCronSettings_repository$key } from './__generated__/RepositoryCronSettings_repository.graphql';

interface Props {
  repository: RepositoryCronSettings_repository$key;
}

const useStyles = makeStyles(theme => {
  return {
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
    },
    avatar: {
      backgroundColor: theme.palette.primary.main,
    },
    avatarIcon: {
      color: theme.palette.primary.contrastText,
    },
    cell: {
      padding: 0,
      height: '100%',
    },
    roundButton: {
      right: 0,
    },
  };
});

export default function RepositoryCronSettings(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositoryCronSettings_repository on Repository {
        id
        owner
        name
        masterBranch
        cronSettings {
          name
          branch
          expression
          ...NextCronInvocationTimeChip_settings
          lastInvocationBuild {
            id
            ...BuildStatusChip_build
          }
        }
      }
    `,
    props.repository,
  );

  let navigate = useNavigate();

  let defaultSettings = {
    name: 'nightly',
    branch: repository.masterBranch,
    expression: '0 0 0 * * ?',
  };
  let [settings, setSettings] = useState(defaultSettings);
  let [cronSettingsList, setCronSettingsList] = useState(repository.cronSettings);

  function changeField(field) {
    return event => {
      let value = event.target.value;
      setSettings({
        ...settings,
        [field]: value,
      });
    };
  }

  const [commitSaveCronSettingsMutation] = useMutation<RepositoryCronSettingsSaveMutation>(graphql`
    mutation RepositoryCronSettingsSaveMutation($input: RepositorySaveCronSettingsInput!) {
      saveCronSettings(input: $input) {
        settings {
          name
          branch
          expression
          ...NextCronInvocationTimeChip_settings
          lastInvocationBuild {
            id
            ...BuildStatusChip_build
          }
        }
      }
    }
  `);
  function addNewCronSetting() {
    const variables: RepositoryCronSettingsSaveMutation$variables = {
      input: {
        clientMutationId: `cron-save-${repository.id}-${settings.name}`,
        repositoryId: repository.id,
        name: settings.name,
        expression: settings.expression,
        branch: settings.branch,
      },
    };

    commitSaveCronSettingsMutation({
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsSaveMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setCronSettingsList(response.saveCronSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  const [commitRemoveCronSettingsMutation] = useMutation<RepositoryCronSettingsRemoveMutation>(
    graphql`
      mutation RepositoryCronSettingsRemoveMutation($input: RepositoryRemoveCronSettingsInput!) {
        removeCronSettings(input: $input) {
          settings {
            name
            branch
            expression
            ...NextCronInvocationTimeChip_settings
            lastInvocationBuild {
              id
              ...BuildStatusChip_build
            }
          }
        }
      }
    `,
  );
  function removeCronSetting(name: string) {
    const variables: RepositoryCronSettingsRemoveMutation$variables = {
      input: {
        clientMutationId: `cron-remove-${repository.id}-${name}`,
        repositoryId: repository.id,
        name: name,
      },
    };

    commitRemoveCronSettingsMutation({
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsRemoveMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setCronSettingsList(response.removeCronSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  let classes = useStyles();
  return (
    <Card elevation={24}>
      <CardHeader title="Cron Settings" />
      <CardContent>
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {cronSettingsList.map(settings => (
              <TableRow hover={true} key={settings.name}>
                <TableCell className={classNames(classes.cell)}>
                  <Chip key={settings.name} className={classes.chip} label={settings.name} />
                </TableCell>
                <TableCell className={classNames(classes.cell)}>
                  <Chip
                    key={settings.branch}
                    className={classes.chip}
                    avatar={
                      <Avatar className={classes.avatar}>
                        <Icon className={classes.avatarIcon}>call_split</Icon>
                      </Avatar>
                    }
                    label={settings.branch}
                  />
                </TableCell>
                <TableCell className={classNames(classes.cell)}>
                  <Chip
                    key={settings.expression}
                    className={classes.chip}
                    avatar={
                      <Avatar className={classes.avatar}>
                        <Icon className={classes.avatarIcon}>alarm</Icon>
                      </Avatar>
                    }
                    label={settings.expression}
                  />
                </TableCell>
                <TableCell
                  className={classes.cell}
                  onClick={event => navigateBuildHelper(navigate, event, settings.lastInvocationBuild?.id)}
                >
                  <div style={{ display: 'flex' }}>
                    <NextCronInvocationTimeChip settings={settings} className={classes.chip} />
                    {settings.lastInvocationBuild ? (
                      <Tooltip title="Last invocation build">
                        <BuildStatusChip build={settings.lastInvocationBuild} className={classes.chip} />
                      </Tooltip>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className={classes.cell} sx={{ justifyContent: 'flex-end' }}>
                  <Tooltip title="Remove Cron Build">
                    <IconButton
                      aria-label="Remove Cron Build"
                      component="span"
                      onClick={() => removeCronSetting(settings.name)}
                      size="large"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <TextField required id="name-lbl" label="Name" defaultValue={settings.name} onChange={changeField('name')} />
        <TextField
          required
          id="branch-lbl"
          label="Branch"
          defaultValue={settings.branch}
          onChange={changeField('branch')}
        />
        <TextField
          required
          id="expression-lbl"
          label="Expression"
          defaultValue={settings.expression}
          onChange={changeField('expression')}
        />
        <Tooltip title="Add New Cron Build">
          <IconButton
            aria-label="Add New Cron Build"
            component="span"
            onClick={() => addNewCronSetting()}
            size="large"
            className={classes.roundButton}
          >
            <Add />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
