import React, { MouseEventHandler, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Card, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Refresh from '@mui/icons-material/Refresh';

import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import HookStatusChip from '../chips/HookStatusChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import TaskNameChip from '../chips/TaskNameChip';
import HookCreatedChip from '../chips/HookCreatedChip';
import RepositoryOwnerChip from '../chips/RepositoryOwnerChip';

import Logs from '../logs/Logs';
import CirrusFavicon from '../common/CirrusFavicon';
import { hasWritePermissions } from '../../utils/permissions';
import { useNotificationColor } from '../../utils/colors';
import { navigateBuildHelper, navigateHookHelper, navigateTaskHelper } from '../../utils/navigateHelper';

import {
  HookDetailsRerunMutation,
  HookDetailsRerunMutation$data,
} from './__generated__/HookDetailsRerunMutation.graphql';
import { HookDetails_hook$key } from './__generated__/HookDetails_hook.graphql';

const useStyles = makeStyles(theme => {
  return {
    gap: {
      paddingTop: theme.spacing(2),
    },
    chip: {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
    wrapper: {
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
    },
    io: {
      padding: theme.spacing(1),
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    potentialError: {
      padding: theme.spacing(1),
    },
  };
});

interface Props {
  hook: HookDetails_hook$key;
}

export default function HookDetails(props: Props) {
  let hook = useFragment(
    graphql`
      fragment HookDetails_hook on Hook {
        id
        repository {
          ...RepositoryOwnerChip_repository
          ...RepositoryNameChip_repository
        }
        build {
          id
          viewerPermission
          ...BuildBranchNameChip_build
          ...BuildChangeChip_build
        }
        task {
          id
          ...TaskNameChip_task
        }
        ...HookCreatedChip_hook
        ...HookStatusChip_hook
        name
        info {
          error
          arguments
          outputLogs
          environment
        }
      }
    `,
    props.hook,
  );

  const [commitDetailsRerunMutation, isInFlight] = useMutation<HookDetailsRerunMutation>(graphql`
    mutation HookDetailsRerunMutation($input: HooksReRunInput!) {
      rerunHooks(input: $input) {
        newHooks {
          id
        }
      }
    }
  `);

  let classes = useStyles();

  let navigate = useNavigate();

  // Parse and prettify hook I/O
  let hookArguments = JSON.parse(hook.info.arguments);
  let prettyHookArguments = JSON.stringify(hookArguments, null, 2);

  // Extract hook-specific data
  let targetName = 'Unsupported';
  let targetState = 'UNSUPPORTED';
  let navigateToAllHooks: MouseEventHandler = _ => alert('Unsupported hook ' + hook.name);

  if (hook.name.startsWith('on_task')) {
    targetName = 'Task';
    targetState = hookArguments[0].payload.data.task.status;
    navigateToAllHooks = e => navigateTaskHelper(navigate, e, hook.task.id, true);
  }

  if (hook.name.startsWith('on_build')) {
    targetName = 'Build';
    targetState = hookArguments[0].payload.data.build.status;
    navigateToAllHooks = e => navigateBuildHelper(navigate, e, hook.build.id, true);
  }

  // In case this is a task hook — display a chip that links to it
  const taskChip =
    hook.task != null ? <TaskNameChip className={classes.chip} task={hook.task} withNavigation={true} /> : null;

  // Potential error from the hook execution
  let headerStyle = {
    backgroundColor: useNotificationColor('ERROR'),
  };
  const potentialError =
    hook.info.error === '' ? null : (
      <div className={classNames('container', classes.gap)}>
        <div
          key={hook.info.error}
          style={headerStyle}
          className={classNames('row', 'justify-content-between', 'align-items-center')}
        >
          <Typography variant="subtitle1" className={classes.potentialError}>
            {hook.info.error}
          </Typography>
        </div>
      </div>
    );

  function rerunHook(hookId: string) {
    commitDetailsRerunMutation({
      variables: {
        input: {
          clientMutationId: 'rerun-' + hookId,
          hookIds: [hookId],
        },
      },
      onCompleted: (response: HookDetailsRerunMutation$data, error) => {
        if (error) {
          console.log(error);
          return;
        }
        if (response.rerunHooks) {
          navigateHookHelper(navigate, null, response.rerunHooks.newHooks[0].id);
        }
      },
      onError: err => console.error(err),
    });
  }

  let rerunButton = !hasWritePermissions(hook.build.viewerPermission) ? null : (
    <Button variant="contained" onClick={() => rerunHook(hook.id)} startIcon={<Refresh />} disabled={isInFlight}>
      Re-Run
    </Button>
  );

  const executionLogs =
    hook.info.outputLogs.length === 0 ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>
          There doesn't seem to be anything here. Try generating some logs with <code>print()</code>!
        </span>
      </div>
    ) : (
      <Logs logsName="output" logs={hook.info.outputLogs.join('\n')} />
    );

  useEffect(() => {
    document.title = `${targetName} hook - Cirrus CI`;
  }, [targetName]);

  return (
    <div>
      <CirrusFavicon status={hook.info.error === ''} />
      <Card elevation={24}>
        <CardContent>
          <div className={classes.wrapper}>
            <RepositoryOwnerChip className={classes.chip} repository={hook.repository} />
            <RepositoryNameChip className={classes.chip} repository={hook.repository} />
            <BuildBranchNameChip className={classes.chip} build={hook.build} />
            <BuildChangeChip className={classes.chip} build={hook.build} />
            {taskChip}
          </div>
          <div className={classes.wrapper}>
            <HookCreatedChip className={classes.chip} hook={hook} />
            <HookStatusChip className={classes.chip} hook={hook} />
          </div>
          <div className={classes.gap} />
          <Typography variant="h6" gutterBottom>
            {targetName} hook
          </Typography>
          <p>
            Triggered because <code>{hook.name}()</code> was defined and the has task entered the{' '}
            <code>{targetState}</code> state.
          </p>
        </CardContent>
        <CardActions style={{ justifyContent: 'end' }}>
          <Button variant="contained" onClick={navigateToAllHooks} startIcon={<ArrowBack />}>
            View All Hooks
          </Button>
          {rerunButton}
        </CardActions>
      </Card>
      {potentialError}
      <div className={classes.gap} />
      <Card elevation={24}>
        <CardContent>
          <Typography variant="h6">Execution logs</Typography>
          {executionLogs}
        </CardContent>
      </Card>
      <div className={classes.gap} />
      <Card elevation={24}>
        <CardContent>
          <Typography variant="h6">Arguments</Typography>
          <pre className={classNames(classes.io, 'log-line')}>{prettyHookArguments}</pre>
        </CardContent>
      </Card>
      <div className={classes.gap} />
      <Card elevation={24}>
        <CardContent>
          <Typography variant="h6">Environment variables</Typography>
          <pre className={classNames(classes.io, 'log-line')}>{hook.info.environment.join('\n')}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
