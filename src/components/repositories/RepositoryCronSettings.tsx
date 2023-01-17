import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { RepositoryCronSettings_repository } from './__generated__/RepositoryCronSettings_repository.graphql';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import BuildStatusChip from '../chips/BuildStatusChip';
import { Add, Delete } from '@mui/icons-material';
import environment from '../../createRelayEnvironment';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import NextCronInvocationTimeChip from '../chips/NextCronInvocationTimeChip';
import {
  RepositoryCronSettingsSaveMutationResponse,
  RepositoryCronSettingsSaveMutationVariables,
} from './__generated__/RepositoryCronSettingsSaveMutation.graphql';
import {
  RepositoryCronSettingsRemoveMutationResponse,
  RepositoryCronSettingsRemoveMutationVariables,
} from './__generated__/RepositoryCronSettingsRemoveMutation.graphql';
import { navigateBuildHelper } from '../../utils/navigateHelper';
import { CardActions } from '@mui/material';

const saveCronSettingsMutation = graphql`
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
`;

const removeCronSettingsMutation = graphql`
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
`;

interface Props extends WithStyles<typeof styles> {
  repository: RepositoryCronSettings_repository;
}

const styles = theme =>
  createStyles({
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
  });

function RepositoryCronSettings(props: Props) {
  let navigate = useNavigate();

  let defaultSettings = {
    name: 'nightly',
    branch: props.repository.masterBranch,
    expression: '0 0 0 * * ?',
  };
  let [settings, setSettings] = useState(defaultSettings);
  let [cronSettingsList, setCronSettingsList] = useState(props.repository.cronSettings);

  function changeField(field) {
    return event => {
      let value = event.target.value;
      setSettings({
        ...settings,
        [field]: value,
      });
    };
  }

  function addNewCronSetting() {
    const variables: RepositoryCronSettingsSaveMutationVariables = {
      input: {
        clientMutationId: `cron-save-${props.repository.id}-${settings.name}`,
        repositoryId: props.repository.id,
        name: settings.name,
        expression: settings.expression,
        branch: settings.branch,
      },
    };

    commitMutation(environment, {
      mutation: saveCronSettingsMutation,
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsSaveMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        if (!response.saveCronSettings?.settings) return;
        setCronSettingsList(response.saveCronSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  function removeCronSetting(name: string) {
    const variables: RepositoryCronSettingsRemoveMutationVariables = {
      input: {
        clientMutationId: `cron-remove-${props.repository.id}-${name}`,
        repositoryId: props.repository.id,
        name: name,
      },
    };

    commitMutation(environment, {
      mutation: removeCronSettingsMutation,
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsRemoveMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        if (!response.removeCronSettings?.settings) return;
        setCronSettingsList(response.removeCronSettings.settings);
      },
      onError: err => console.error(err),
    });
  }

  let { classes } = props;
  return (
    <Card elevation={24}>
      <CardHeader title="Cron Settings" />
      <CardContent>
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {cronSettingsList.map(
              settings =>
                settings && (
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
                ),
            )}
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

export default createFragmentContainer(withStyles(styles)(RepositoryCronSettings), {
  repository: graphql`
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
});
