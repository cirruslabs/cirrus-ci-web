import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { commitMutation, createFragmentContainer, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { hasWritePermissions } from '../../utils/permissions';
import BuildCreatedChip from '../chips/BuildCreatedChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import CirrusFavicon from '../common/CirrusFavicon';
import TaskList from '../tasks/TaskList';
import { BuildDetails_build } from './__generated__/BuildDetails_build.graphql';
import { Helmet as Head } from 'react-helmet';
import Refresh from '@mui/icons-material/Refresh';
import Check from '@mui/icons-material/Check';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import Notification from '../common/Notification';
import classNames from 'classnames';
import ConfigurationWithIssues from './ConfigurationWithIssues';
import HookList from '../hooks/HookList';
import { Box, Collapse, Link, Tab, ToggleButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { BugReport, Dehaze, Functions, Stop } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import DebuggingInformation from './DebuggingInformation';
import RepositoryOwnerChip from '../chips/RepositoryOwnerChip';
import { HookType } from '../hooks/HookType';
import { BuildDetailsApproveBuildMutationVariables } from './__generated__/BuildDetailsApproveBuildMutation.graphql';
import { BuildDetailsReTriggerMutationVariables } from './__generated__/BuildDetailsReTriggerMutation.graphql';
import { BuildDetailsReRunMutationVariables } from './__generated__/BuildDetailsReRunMutation.graphql';
import { BuildDetailsCancelMutationVariables } from './__generated__/BuildDetailsCancelMutation.graphql';

const buildApproveMutation = graphql`
  mutation BuildDetailsApproveBuildMutation($input: BuildApproveInput!) {
    approve(input: $input) {
      build {
        ...BuildDetails_build
      }
    }
  }
`;

const buildReTriggerMutation = graphql`
  mutation BuildDetailsReTriggerMutation($input: BuildReTriggerInput!) {
    retrigger(input: $input) {
      build {
        ...BuildDetails_build
      }
    }
  }
`;

const buildSubscription = graphql`
  subscription BuildDetailsSubscription($buildID: ID!) {
    build(id: $buildID) {
      id
      durationInSeconds
      status
      notifications {
        ...Notification_notification
      }
      latestGroupTasks {
        id
        localGroupId
        requiredGroups
        status
        ...TaskListRow_task
      }
    }
  }
`;

const taskBatchReRunMutation = graphql`
  mutation BuildDetailsReRunMutation($input: TasksReRunInput!) {
    batchReRun(input: $input) {
      newTasks {
        build {
          ...BuildDetails_build
        }
      }
    }
  }
`;

const taskCancelMutation = graphql`
  mutation BuildDetailsCancelMutation($input: TaskAbortInput!) {
    abortTask(input: $input) {
      abortedTask {
        id
      }
    }
  }
`;

const styles = () =>
  createStyles({
    gap: {
      paddingTop: 16,
    },
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginRight: 4,
    },
    wrapper: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
    },
    tabPanel: {
      padding: 0,
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildDetails_build;
}

function BuildDetails(props: Props) {
  useEffect(() => {
    let variables = { buildID: props.build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.build.id]);
  const { build, classes } = props;

  function approveBuild() {
    const variables: BuildDetailsApproveBuildMutationVariables = {
      input: {
        clientMutationId: 'approve-build-' + build.id,
        buildId: build.id,
      },
    };

    commitMutation(environment, {
      mutation: buildApproveMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function reTriggerBuild() {
    const variables: BuildDetailsReTriggerMutationVariables = {
      input: {
        clientMutationId: 're-trigger-build-' + build.id,
        buildId: build.id,
      },
    };

    commitMutation(environment, {
      mutation: buildReTriggerMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function batchReRun(taskIds) {
    const variables: BuildDetailsReRunMutationVariables = {
      input: {
        clientMutationId: 'batch-rerun-' + props.build.id,
        taskIds: taskIds,
      },
    };

    commitMutation(environment, {
      mutation: taskBatchReRunMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function batchCancellation(taskIds: string[]) {
    taskIds.forEach(id => {
      const variables: BuildDetailsCancelMutationVariables = {
        input: {
          clientMutationId: `batch-cancellation-${props.build.id}-${id}`,
          taskId: id,
        },
      };

      commitMutation(environment, {
        mutation: taskCancelMutation,
        variables: variables,
        onError: err => console.error(err),
      });
    });
  }

  const repoUrl = build.repository.cloneUrl.slice(0, -4);
  const branchUrl = build.branch.startsWith('pull/') ? `${repoUrl}/${build.branch}` : `${repoUrl}/tree/${build.branch}`;
  const commitUrl = repoUrl + '/commit/' + build.changeIdInRepo;

  const notificationsComponent = !build.notifications ? null : (
    <div className={classNames('container', classes.gap)}>
      {build.notifications.map(notification => (
        <Notification key={notification.message} notification={notification} />
      ))}
    </div>
  );

  const canBeReTriggered =
    (build.status === 'FAILED' || build.status === 'ERRORED') &&
    hasWritePermissions(build.repository.viewerPermission) &&
    build.latestGroupTasks &&
    build.latestGroupTasks.length === 0;
  const reTriggerButton = !canBeReTriggered ? null : (
    <Button variant="contained" onClick={() => reTriggerBuild()} startIcon={<Refresh />}>
      Re-Trigger
    </Button>
  );

  const hasWritePermission = hasWritePermissions(build.repository.viewerPermission);
  const failedTaskIds = build.latestGroupTasks
    .filter(task => task.status === 'FAILED' || (task.status === 'ABORTED' && task.requiredGroups.length === 0))
    .map(task => task.id);
  const runningTaskIds = build.latestGroupTasks
    .filter(task => ['SCHEDULED', 'CREATED', 'EXECUTING', 'TRIGGERED'].includes(task.status))
    .map(task => task.id);
  const reRunAllTasksButton =
    failedTaskIds.length === 0 || !hasWritePermission ? null : (
      <Button variant="contained" onClick={() => batchReRun(failedTaskIds)} startIcon={<Refresh />}>
        Re-Run Failed Tasks
      </Button>
    );
  const cancelAllTasksButton =
    runningTaskIds.length === 0 || !hasWritePermission ? null : (
      <Button variant="contained" onClick={() => batchCancellation(runningTaskIds)} startIcon={<Stop />}>
        Cancel All Tasks
      </Button>
    );

  const needsApproval = build.status === 'NEEDS_APPROVAL' && hasWritePermission;
  const approveButton = !needsApproval ? null : (
    <Button variant="contained" onClick={() => approveBuild()} startIcon={<Check />}>
      Approve
    </Button>
  );

  const [currentTab, setCurrentTab] = React.useState('1');
  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const tabbedTasksAndHooks = (
    <TabContext value={currentTab}>
      <TabList onChange={handleChange}>
        <Tab icon={<Dehaze />} label={'Tasks (' + build.latestGroupTasks.length + ')'} value="1" />
        <Tab icon={<Functions />} label={'Hooks (' + build.hooks.length + ')'} value="2" />
      </TabList>
      <TabPanel value="1" className={classes.tabPanel}>
        <TaskList tasks={build.latestGroupTasks} />
      </TabPanel>
      <TabPanel value="2" className={classes.tabPanel}>
        <HookList hooks={build.hooks} type={HookType.Build} />
      </TabPanel>
    </TabContext>
  );

  const [displayDebugInfo, setDisplayDebugInfo] = React.useState(false);
  const toggleDisplayDebugInfo = () => {
    setDisplayDebugInfo(!displayDebugInfo);
  };

  return (
    <div>
      <CirrusFavicon status={build.status} />
      <Head>
        <title>{build.changeMessageTitle} - Cirrus CI</title>
      </Head>
      <Card elevation={24}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div>
              <div className={classes.wrapper}>
                <RepositoryOwnerChip className={classes.chip} repository={build.repository} />
                <RepositoryNameChip className={classes.chip} repository={build.repository} />
                <BuildBranchNameChip className={classes.chip} build={build} />
              </div>
              <div className={classes.wrapper}>
                <BuildCreatedChip className={classes.chip} build={build} />
                <BuildStatusChip className={classes.chip} build={build} />
              </div>
            </div>
            <div>
              <Tooltip title="Debugging Information">
                <ToggleButton value="bug" onClick={toggleDisplayDebugInfo} selected={displayDebugInfo}>
                  <BugReport />
                </ToggleButton>
              </Tooltip>
            </div>
          </Box>
          <div className={classes.gap} />
          <Typography variant="h6" gutterBottom>
            {build.changeMessageTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Commit{' '}
            <Link href={commitUrl} color="inherit" target="_blank" rel="noopener noreferrer">
              {build.changeIdInRepo.substr(0, 7)}
            </Link>{' '}
            on branch{' '}
            <Link href={branchUrl} color="inherit" target="_blank" rel="noopener noreferrer">
              {build.branch}
            </Link>
            .
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {reTriggerButton}
          {approveButton}
          {reRunAllTasksButton}
          {cancelAllTasksButton}
        </CardActions>
      </Card>
      <ConfigurationWithIssues build={build} />
      {notificationsComponent}
      <Collapse in={displayDebugInfo}>
        <DebuggingInformation build={build} />
      </Collapse>
      <div className={classes.gap} />
      <Paper elevation={24}>{tabbedTasksAndHooks}</Paper>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(BuildDetails), {
  build: graphql`
    fragment BuildDetails_build on Build {
      id
      branch
      status
      changeIdInRepo
      changeMessageTitle
      ...BuildCreatedChip_build
      ...BuildBranchNameChip_build
      ...BuildStatusChip_build
      notifications {
        message
        ...Notification_notification
      }
      ...ConfigurationWithIssues_build
      ...DebuggingInformation_build
      latestGroupTasks {
        id
        localGroupId
        requiredGroups
        scheduledTimestamp
        executingTimestamp
        finalStatusTimestamp
        status
        ...TaskListRow_task
      }
      repository {
        ...RepositoryOwnerChip_repository
        ...RepositoryNameChip_repository
        cloneUrl
        viewerPermission
      }
      hooks {
        timestamp
        ...HookListRow_hook
      }
    }
  `,
});
