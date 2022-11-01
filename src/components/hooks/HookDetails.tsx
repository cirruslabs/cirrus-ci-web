import React, { MouseEventHandler } from 'react';

import { commitMutation, createFragmentContainer } from 'react-relay';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { graphql } from 'babel-plugin-relay/macro';
import { HookDetails_hook } from './__generated__/HookDetails_hook.graphql';
import { Helmet as Head } from 'react-helmet';
import { Card, CardContent } from '@mui/material';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import TaskNameChip from '../chips/TaskNameChip';
import HookCreatedChip from '../chips/HookCreatedChip';
import Typography from '@mui/material/Typography';
import Logs from '../logs/Logs';
import HookStatusChip from '../chips/HookStatusChip';
import CirrusFavicon from '../common/CirrusFavicon';
import classNames from 'classnames';
import { useNotificationColor } from '../../utils/colors';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { navigateBuildHelper, navigateHookHelper, navigateTaskHelper } from '../../utils/navigateHelper';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { hasWritePermissions } from '../../utils/permissions';
import Refresh from '@mui/icons-material/Refresh';
import environment from '../../createRelayEnvironment';
import {
  HookDetailsRerunMutationResponse,
  HookDetailsRerunMutationVariables,
} from './__generated__/HookDetailsRerunMutation.graphql';
import RepositoryOwnerChip from '../chips/RepositoryOwnerChip';
import { useNavigate } from 'react-router-dom';

const hooksRerunMutation = graphql`
  mutation HookDetailsRerunMutation($input: HooksReRunInput!) {
    rerunHooks(input: $input) {
      newHooks {
        id
      }
    }
  }
`;

const styles = theme =>
  createStyles({
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
  });

interface Props extends WithStyles<typeof styles> {
  hook: HookDetails_hook;
}

function HookDetails(props: Props) {
  let { hook, classes } = props;

  let navigate = useNavigate();

  // Parse and prettify hook I/O
  let hookArguments = JSON.parse(props.hook.info.arguments);
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
          key={props.hook.info.error}
          style={headerStyle}
          className={classNames('row', 'justify-content-between', 'align-items-center')}
        >
          <Typography variant="subtitle1" className={classes.potentialError}>
            {props.hook.info.error}
          </Typography>
        </div>
      </div>
    );

  function rerunHook(hookId: string) {
    const variables: HookDetailsRerunMutationVariables = {
      input: {
        clientMutationId: 'rerun-' + hookId,
        hookIds: [hookId],
      },
    };

    commitMutation(environment, {
      mutation: hooksRerunMutation,
      variables: variables,
      onCompleted: (response: HookDetailsRerunMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        navigateHookHelper(navigate, null, response.rerunHooks.newHooks[0].id);
      },
      onError: err => console.error(err),
    });
  }

  let rerunButton = !hasWritePermissions(hook.build.viewerPermission) ? null : (
    <Button variant="contained" onClick={() => rerunHook(hook.id)} startIcon={<Refresh />}>
      Re-Run
    </Button>
  );

  const executionLogs =
    props.hook.info.outputLogs.length === 0 ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>
          There doesn't seem to be anything here. Try generating some logs with <code>print()</code>!
        </span>
      </div>
    ) : (
      <Logs logsName="output" logs={props.hook.info.outputLogs.join('\n')} />
    );

  return (
    <div>
      <CirrusFavicon status={hook.info.error === ''} />
      <Head>
        <title>{targetName} hook - Cirrus CI</title>
      </Head>
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
          <pre className={classNames(classes.io, 'log-line')}>{props.hook.info.environment.join('\n')}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(HookDetails), {
  hook: graphql`
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
        result
        outputLogs
        environment
      }
    }
  `,
});
