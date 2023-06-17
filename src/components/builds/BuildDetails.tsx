import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect, useMemo } from 'react';
import { useFragment, useMutation, useSubscription } from 'react-relay';
import { hasWritePermissions } from '../../utils/permissions';
import BuildCreatedChip from '../chips/BuildCreatedChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import CirrusFavicon from '../common/CirrusFavicon';
import TaskList from '../tasks/TaskList';
import { BuildDetails_build$key } from './__generated__/BuildDetails_build.graphql';
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
import {
  BuildDetailsApproveBuildMutation,
  BuildDetailsApproveBuildMutation$variables,
} from './__generated__/BuildDetailsApproveBuildMutation.graphql';
import {
  BuildDetailsReTriggerMutation,
  BuildDetailsReTriggerMutation$variables,
} from './__generated__/BuildDetailsReTriggerMutation.graphql';
import {
  BuildDetailsReRunMutation,
  BuildDetailsReRunMutation$variables,
} from './__generated__/BuildDetailsReRunMutation.graphql';
import {
  BuildDetailsCancelMutation,
  BuildDetailsCancelMutation$variables,
} from './__generated__/BuildDetailsCancelMutation.graphql';
import CommitMessage from '../common/CommitMessage';

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
        ...TaskList_tasks
      }
    }
  }
`;

const useStyles = makeStyles(theme => {
  return {
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
  };
});

interface Props {
  build: BuildDetails_build$key;
}

export default function BuildDetails(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildDetails_build on Build {
        id
        branch
        status
        changeIdInRepo
        changeMessageTitle
        ...BuildCreatedChip_build
        ...BuildStatusChip_build
        notifications {
          message
          ...Notification_notification
        }
        ...ConfigurationWithIssues_build
        ...BuildDebuggingInformation_build
        latestGroupTasks {
          id
          status
          requiredGroups
          ...TaskList_tasks
        }
        repository {
          cloneUrl
          viewerPermission
        }
        hooks {
          ...HookList_hooks
        }
      }
    `,
    props.build,
  );

  const buildSubscriptionConfig = useMemo(
    () => ({
      variables: { buildID: build.id },
      subscription: buildSubscription,
    }),
    [build.id],
  );
  useSubscription(buildSubscriptionConfig);

  let classes = useStyles();
  const repository = build.repository;

  const [commitBuildApproveMutation] = useMutation<BuildDetailsApproveBuildMutation>(graphql`
    mutation BuildDetailsApproveBuildMutation($input: BuildApproveInput!) {
      approve(input: $input) {
        build {
          ...BuildDetails_build
        }
      }
    }
  `);

  function approveBuild() {
    const variables: BuildDetailsApproveBuildMutation$variables = {
      input: {
        clientMutationId: 'approve-build-' + build.id,
        buildId: build.id,
      },
    };

    commitBuildApproveMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  const [commitBuildReTriggerMutation] = useMutation<BuildDetailsReTriggerMutation>(graphql`
    mutation BuildDetailsReTriggerMutation($input: BuildReTriggerInput!) {
      retrigger(input: $input) {
        build {
          ...BuildDetails_build
        }
      }
    }
  `);

  function reTriggerBuild() {
    const variables: BuildDetailsReTriggerMutation$variables = {
      input: {
        clientMutationId: 're-trigger-build-' + build.id,
        buildId: build.id,
      },
    };

    commitBuildReTriggerMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  const [commitTaskBatchReRunMutation] = useMutation<BuildDetailsReRunMutation>(graphql`
    mutation BuildDetailsReRunMutation($input: TasksReRunInput!) {
      batchReRun(input: $input) {
        newTasks {
          build {
            ...BuildDetails_build
          }
        }
      }
    }
  `);

  function batchReRun(taskIds) {
    const variables: BuildDetailsReRunMutation$variables = {
      input: {
        clientMutationId: 'batch-rerun-' + build.id,
        taskIds: taskIds,
      },
    };

    commitTaskBatchReRunMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  const [commitTaskCancelMutation] = useMutation<BuildDetailsCancelMutation>(graphql`
    mutation BuildDetailsCancelMutation($input: TaskAbortInput!) {
      abortTask(input: $input) {
        abortedTask {
          id
        }
      }
    }
  `);

  function batchCancellation(taskIds: string[]) {
    taskIds.forEach(id => {
      const variables: BuildDetailsCancelMutation$variables = {
        input: {
          clientMutationId: `batch-cancellation-${build.id}-${id}`,
          taskId: id,
        },
      };

      commitTaskCancelMutation({
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

  useEffect(() => {
    document.title = `${build.changeMessageTitle} - Cirrus CI`;
  }, [build.changeMessageTitle]);

  return (
    <div>
      <CirrusFavicon status={build.status} />
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
