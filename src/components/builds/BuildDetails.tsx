import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { commitMutation, createFragmentContainer, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { hasWritePermissions } from '../../utils/permissions';
import BuildCreatedChip from '../chips/BuildCreatedChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import CirrusFavicon from '../common/CirrusFavicon';
import TaskList from '../tasks/TaskList';
import { BuildDetails_build } from './__generated__/BuildDetails_build.graphql';
import { Helmet as Head } from 'react-helmet';
import Refresh from '@mui/icons-material/Refresh';
import Check from '@mui/icons-material/Check';
import Notification from '../common/Notification';
import ConfigurationWithIssues from './ConfigurationWithIssues';
import HookList from '../hooks/HookList';
import { Box, Collapse, List, Tab, ToggleButton } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { BugReport, Cancel, Dehaze, Functions } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import DebuggingInformation from './BuildDebuggingInformation';
import { HookType } from '../hooks/HookType';
import { BuildDetailsApproveBuildMutationVariables } from './__generated__/BuildDetailsApproveBuildMutation.graphql';
import { BuildDetailsReTriggerMutationVariables } from './__generated__/BuildDetailsReTriggerMutation.graphql';
import { BuildDetailsReRunMutationVariables } from './__generated__/BuildDetailsReRunMutation.graphql';
import { BuildDetailsCancelMutationVariables } from './__generated__/BuildDetailsCancelMutation.graphql';
import CommitMessage from '../common/CommitMessage';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

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
  const repository = build.repository;

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

  const notificationsComponent = !build.notifications ? null : (
    <List>
      {build.notifications.map(notification => (
        <Notification key={notification.message} notification={notification} />
      ))}
    </List>
  );

  const canBeReTriggered =
    (build.status === 'FAILED' ||
      build.status === 'ERRORED' ||
      build.status === 'COMPLETED' ||
      build.status === 'ABORTED') &&
    hasWritePermissions(build.repository.viewerPermission) &&
    build.latestGroupTasks &&
    build.latestGroupTasks.length === 0;
  const reTriggerButton = !canBeReTriggered ? null : (
    <Button variant="contained" onClick={() => reTriggerBuild()} startIcon={<Refresh />}>
      Re-Trigger
    </Button>
  );

  const hasWritePermission = hasWritePermissions(build.repository.viewerPermission);
  const allTaskIds = build.latestGroupTasks.map(task => task.id);
  const failedTaskIds = build.latestGroupTasks
    .filter(task => task.status === 'FAILED' || (task.status === 'ABORTED' && task.requiredGroups.length === 0))
    .map(task => task.id);
  const runningTaskIds = build.latestGroupTasks
    .filter(task => ['SCHEDULED', 'CREATED', 'EXECUTING', 'TRIGGERED'].includes(task.status))
    .map(task => task.id);
  const reRunAllTasksButton =
    allTaskIds.length === runningTaskIds.length || !hasWritePermission ? null : (
      <Button variant="contained" onClick={() => batchReRun(allTaskIds)} startIcon={<Refresh />}>
        Re-Run All Tasks
      </Button>
    );
  const reRunFailedTasksButton =
    failedTaskIds.length === 0 || !hasWritePermission ? null : (
      <Button variant="contained" onClick={() => batchReRun(failedTaskIds)} startIcon={<Refresh />}>
        Re-Run Failed Tasks
      </Button>
    );
  const cancelAllTasksButton =
    runningTaskIds.length === 0 || !hasWritePermission ? null : (
      <Button variant="contained" onClick={() => batchCancellation(runningTaskIds)} startIcon={<Cancel />}>
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
      <AppBreadcrumbs
        platform={build.repository.platform}
        ownerName={build.repository.owner}
        repositoryName={build.repository.name}
        branchName={build.branch}
        buildHash={build.changeIdInRepo.substr(0, 7)}
        buildId={build.id}
      />
      <CirrusFavicon status={build.status} />
      <Head>
        <title>{build.changeMessageTitle} - Cirrus CI</title>
      </Head>
      <Card elevation={24}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div>
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
          <CommitMessage
            cloneUrl={repository.cloneUrl}
            branch={build.branch}
            changeIdInRepo={build.changeIdInRepo}
            changeMessageTitle={build.changeMessageTitle}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {reTriggerButton}
          {approveButton}
          {reRunAllTasksButton}
          {reRunFailedTasksButton}
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
      ...BuildDebuggingInformation_build
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
        platform
        owner
        name
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
