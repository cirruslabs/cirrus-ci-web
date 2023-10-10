import React, { useEffect, useMemo } from 'react';
import { useFragment, useMutation, useSubscription } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import BuildCreatedChip from 'components/chips/BuildCreatedChip';
import BuildStatusChip from 'components/chips/BuildStatusChip';
import CirrusFavicon from 'components/common/CirrusFavicon';
import CommitMessage from 'components/common/CommitMessage';
import Notification from 'components/common/Notification';
import HookList from 'components/hooks/HookList';
import { HookType } from 'components/hooks/HookType';
import TaskList from 'components/tasks/TaskList';
import { hasWritePermissions } from 'utils/permissions';

import DebuggingInformation from './BuildDebuggingInformation';
import ConfigurationWithIssues from './ConfigurationWithIssues';
import {
  BuildDetailsApproveBuildMutation,
  BuildDetailsApproveBuildMutation$variables,
} from './__generated__/BuildDetailsApproveBuildMutation.graphql';
import {
  BuildDetailsCancelMutation,
  BuildDetailsCancelMutation$variables,
} from './__generated__/BuildDetailsCancelMutation.graphql';
import {
  BuildDetailsReRunMutation,
  BuildDetailsReRunMutation$variables,
} from './__generated__/BuildDetailsReRunMutation.graphql';
import {
  BuildDetailsReTriggerMutation,
  BuildDetailsReTriggerMutation$variables,
} from './__generated__/BuildDetailsReTriggerMutation.graphql';
import { BuildDetails_build$key } from './__generated__/BuildDetails_build.graphql';
import {isTaskFinalStatus} from "../../utils/status";

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

const useStyles = mui.makeStyles(theme => {
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
    <mui.List>
      {build.notifications.map(notification => (
        <Notification key={notification.message} notification={notification} />
      ))}
    </mui.List>
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
    <mui.Button variant="contained" onClick={() => reTriggerBuild()} startIcon={<mui.icons.Refresh />}>
      Re-Trigger
    </mui.Button>
  );

  const hasWritePermission = hasWritePermissions(build.repository.viewerPermission);
  const finishedTaskIds = build.latestGroupTasks
    .filter(task => isTaskFinalStatus(task.status) && task.status !== 'SKIPPED')
    .map(task => task.id);
  const failedTaskIds = build.latestGroupTasks
    .filter(task => task.status === 'FAILED' || (task.status === 'ABORTED' && task.requiredGroups.length === 0))
    .map(task => task.id);
  const runningTaskIds = build.latestGroupTasks
    .filter(task => ['SCHEDULED', 'CREATED', 'EXECUTING', 'TRIGGERED'].includes(task.status))
    .map(task => task.id);
  const reRunAllTasksButton =
    finishedTaskIds.length === 0 || !hasWritePermission ? null : (
      <mui.Tooltip title="Re-Run tasks that finished executing">
        <mui.Button variant="contained" onClick={() => batchReRun(finishedTaskIds)} startIcon={<mui.icons.Refresh />}>
          Re-Run All Tasks
        </mui.Button>
      </mui.Tooltip>
    );
  const reRunFailedTasksButton =
    failedTaskIds.length === 0 || !hasWritePermission ? null : (
      <mui.Button variant="contained" onClick={() => batchReRun(failedTaskIds)} startIcon={<mui.icons.Refresh />}>
        Re-Run Failed Tasks
      </mui.Button>
    );
  const cancelAllTasksButton =
    runningTaskIds.length === 0 || !hasWritePermission ? null : (
      <mui.Button
        variant="contained"
        onClick={() => batchCancellation(runningTaskIds)}
        startIcon={<mui.icons.Cancel />}
      >
        Cancel All Tasks
      </mui.Button>
    );

  const needsApproval = build.status === 'NEEDS_APPROVAL' && hasWritePermission;
  const approveButton = !needsApproval ? null : (
    <mui.Button variant="contained" onClick={() => approveBuild()} startIcon={<mui.icons.Check />}>
      Approve
    </mui.Button>
  );

  const [currentTab, setCurrentTab] = React.useState('1');
  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const tabbedTasksAndHooks = (
    <mui.TabContext value={currentTab}>
      <mui.TabList onChange={handleChange}>
        <mui.Tab icon={<mui.icons.Dehaze />} label={'Tasks (' + build.latestGroupTasks.length + ')'} value="1" />
        <mui.Tab icon={<mui.icons.Functions />} label={'Hooks (' + build.hooks.length + ')'} value="2" />
      </mui.TabList>
      <mui.TabPanel value="1" className={classes.tabPanel}>
        <TaskList tasks={build.latestGroupTasks} />
      </mui.TabPanel>
      <mui.TabPanel value="2" className={classes.tabPanel}>
        <HookList hooks={build.hooks} type={HookType.Build} />
      </mui.TabPanel>
    </mui.TabContext>
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
      <mui.Card elevation={24}>
        <mui.CardContent>
          <mui.Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div>
              <div className={classes.wrapper}>
                <BuildCreatedChip className={classes.chip} build={build} />
                <BuildStatusChip className={classes.chip} build={build} />
              </div>
            </div>
            <div>
              <mui.Tooltip title="Debugging Information">
                <mui.ToggleButton
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                  value="bug"
                  onClick={toggleDisplayDebugInfo}
                  selected={displayDebugInfo}
                >
                  <mui.icons.BugReport />
                </mui.ToggleButton>
              </mui.Tooltip>
            </div>
          </mui.Box>
          <div className={classes.gap} />
          <CommitMessage
            cloneUrl={repository.cloneUrl}
            branch={build.branch}
            changeIdInRepo={build.changeIdInRepo}
            changeMessageTitle={build.changeMessageTitle}
          />
        </mui.CardContent>
        <mui.CardActions sx={{ justifyContent: 'flex-end' }}>
          {reTriggerButton}
          {approveButton}
          {reRunAllTasksButton}
          {reRunFailedTasksButton}
          {cancelAllTasksButton}
        </mui.CardActions>
      </mui.Card>
      <ConfigurationWithIssues build={build} />
      {notificationsComponent}
      <mui.Collapse in={displayDebugInfo}>
        <DebuggingInformation build={build} />
      </mui.Collapse>
      <div className={classes.gap} />
      <mui.Paper elevation={24}>{tabbedTasksAndHooks}</mui.Paper>
    </div>
  );
}
