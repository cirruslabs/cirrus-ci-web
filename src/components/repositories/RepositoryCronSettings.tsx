import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { RepositoryCronSettings_repository } from './__generated__/RepositoryCronSettings_repository.graphql';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import BuildStatusChip from '../chips/BuildStatusChip';
import { Add, Delete } from '@material-ui/icons';
import environment from '../../createRelayEnvironment';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import NextCronInvocationTimeChip from '../chips/NextCronInvocationTimeChip';
import { RepositoryCronSettingsSaveMutationResponse } from './__generated__/RepositoryCronSettingsSaveMutation.graphql';
import { RepositoryCronSettingsRemoveMutationResponse } from './__generated__/RepositoryCronSettingsRemoveMutation.graphql';
import { navigateBuild } from '../../utils/navigate';

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
    cellContent: {
      margin: theme.spacing(1.0),
      width: '100%',
      height: '100%',
    },
    roundButton: {
      right: 0,
    },
  });

function RepositoryCronSettings(props: Props) {
  let history = useHistory();

  let defaultSettings = {
    name: 'nightly',
    branch: props.repository.masterBranch,
    expression: '0 0 0 * * ?',
  };
  let [settings, setSettings] = useState(defaultSettings);

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
    const variables = {
      input: {
        clientMutationId: `cron-save-${props.repository.id}-${settings.name}`,
        repositoryId: parseInt(props.repository.id, 10),
        name: settings.name,
        expression: settings.expression,
        branch: settings.branch,
      },
    };

    commitMutation(environment, {
      mutation: saveCronSettingsMutation,
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsSaveMutationResponse) => {
        setSettings(defaultSettings);
      },
      onError: err => console.error(err),
    });
  }

  function removeCronSetting(name: string) {
    const variables = {
      input: {
        clientMutationId: `cron-remove-${props.repository.id}-${name}`,
        repositoryId: parseInt(props.repository.id, 10),
        name: name,
      },
    };

    commitMutation(environment, {
      mutation: removeCronSettingsMutation,
      variables: variables,
      onCompleted: (response: RepositoryCronSettingsRemoveMutationResponse) => {
        setSettings(defaultSettings);
      },
      onError: err => console.error(err),
    });
  }

  let { classes } = props;
  return (
    <Card>
      <CardHeader title="Cron Settings" />
      <CardContent>
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {props.repository.cronSettings.map(settings => (
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
                  onClick={event => navigateBuild(history, event, settings.lastInvocationBuild?.id)}
                >
                  <div className="d-flex">
                    <NextCronInvocationTimeChip settings={settings} className={classes.chip} />
                    {settings.lastInvocationBuild ? (
                      <BuildStatusChip build={settings.lastInvocationBuild} className={classes.chip} />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className={classes.cell}>
                  <div className="d-flex justify-content-end">
                    <Tooltip title="Remove Cron Build">
                      <IconButton
                        aria-label="Remove Cron Build"
                        component="span"
                        onClick={() => removeCronSetting(settings.name)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow hover={false}>
              <TableCell className={classNames(classes.cell)}>
                <TextField
                  required
                  id="name-lbl"
                  className={classes.cellContent}
                  label="Name"
                  defaultValue={settings.name}
                  onChange={changeField('name')}
                />
              </TableCell>
              <TableCell className={classNames(classes.cell)}>
                <TextField
                  required
                  id="branch-lbl"
                  className={classes.cellContent}
                  label="Branch"
                  defaultValue={settings.branch}
                  onChange={changeField('branch')}
                />
              </TableCell>
              <TableCell className={classNames(classes.cell)}>
                <TextField
                  required
                  id="expression-lbl"
                  className={classes.cellContent}
                  label="Expression"
                  defaultValue={settings.expression}
                  onChange={changeField('expression')}
                />
              </TableCell>
              <TableCell className={classes.cell}>{/* empty since RepositoryCronRow has 4 colums */}</TableCell>
              <TableCell className={classes.cell}>
                <div className="d-flex justify-content-end">
                  <Tooltip title="Add New Cron Build" className={classes.roundButton}>
                    <IconButton aria-label="Add New Cron Build" component="span" onClick={() => addNewCronSetting()}>
                      <Add />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
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
