import React from 'react';

import { createFragmentContainer } from 'react-relay';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { graphql } from 'babel-plugin-relay/macro';
import { HookDetails_hook } from './__generated__/HookDetails_hook.graphql';
import { Helmet as Head } from 'react-helmet';
import { Card, CardContent } from '@material-ui/core';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import TaskNameChip from '../chips/TaskNameChip';
import HookCreatedChip from '../chips/HookCreatedChip';
import Typography from '@material-ui/core/Typography';
import Logs from '../logs/Logs';
import HookStatusChip from '../chips/HookStatusChip';
import CirrusFavicon from '../common/CirrusFavicon';
import classNames from 'classnames';
import { useNotificationColor } from '../../utils/colors';

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
      background: '#212121',
      color: '#FFFFFF',
      fontSize: '12px',
      fontFamily: 'Monaco, monospace',
    },
    potentialError: {
      padding: 8,
    },
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  hook: HookDetails_hook;
}

function HookDetails(props: Props, context) {
  let { hook, classes } = props;

  // Parse and prettify hook I/O
  let hookArguments = JSON.parse(props.hook.info.arguments);
  let prettyHookArguments = JSON.stringify(hookArguments, null, 2);

  // Extract hook-specific data
  let targetName;
  let targetState;

  switch (hook.name) {
    case 'on_task':
      targetName = 'Task';
      targetState = hookArguments[0].payload.data.task.status;
      break;
    case 'on_build':
      targetName = 'Build';
      targetState = hookArguments[0].payload.data.build.status;
      break;
    default:
      targetName = 'Unknown';
      targetState = 'UNKNOWN';
      break;
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

  return (
    <div>
      <CirrusFavicon status={hook.info.error === ''} />
      <Head>
        <title>{targetName} hook - Cirrus CI</title>
      </Head>
      <Card>
        <CardContent>
          <div className={classes.wrapper}>
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
      </Card>
      {potentialError}
      <div className={classes.gap} />
      <Card>
        <CardContent>
          <Typography variant="h6">Execution logs</Typography>
          <Logs logsName="output" logs={props.hook.info.outputLogs.join('\n')} />
        </CardContent>
      </Card>
      <div className={classes.gap} />
      <Card>
        <CardContent>
          <Typography variant="h6">Arguments</Typography>
          <pre className={classes.io}>{prettyHookArguments}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(withRouter(HookDetails)), {
  hook: graphql`
    fragment HookDetails_hook on Hook {
      repository {
        ...RepositoryNameChip_repository
      }
      build {
        changeMessageTitle
        ...BuildBranchNameChip_build
        ...BuildChangeChip_build
      }
      task {
        name
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
      }
    }
  `,
});
