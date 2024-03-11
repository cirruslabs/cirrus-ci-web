import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { requestSubscription, useFragment, useMutation } from 'react-relay';
import { useLocation, useNavigate } from 'react-router-dom';

import * as graphlib from '@dagrejs/graphlib';
import * as _ from 'lodash';
import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import environment from 'createRelayEnvironment';
import mui from 'mui';

import TaskArtifacts from 'components/artifacts/TaskArtifacts';
import TaskCancellerChip from 'components/chips/TaskCancellerChip';
import TaskCreatedChip from 'components/chips/TaskCreatedChip';
import TaskExperimentalChip from 'components/chips/TaskExperimentalChip';
import TaskOptionalChip from 'components/chips/TaskOptionalChip';
import TaskRerunnerChip from 'components/chips/TaskRerunnerChip';
import TaskResourcesChip from 'components/chips/TaskResourcesChip';
import TaskScheduledChip from 'components/chips/TaskScheduledChip';
import TaskStatefulChip from 'components/chips/TaskStatefulChip';
import TaskStatusChip from 'components/chips/TaskStatusChip';
import TaskTimeoutChip from 'components/chips/TaskTimeoutChip';
import TaskTransactionChip from 'components/chips/TaskTransactionChip';
import { CirrusTerminal } from 'components/cirrus-terminal/CirrusTerminal';
import CirrusFavicon from 'components/common/CirrusFavicon';
import CirrusLinearProgress from 'components/common/CirrusLinearProgress';
import CommitMessage from 'components/common/CommitMessage';
import Notification from 'components/common/Notification';
import ExecutionInfo from 'components/common/TaskExecutionInfo';
import HookList from 'components/hooks/HookList';
import { HookType } from 'components/hooks/HookType';
import { navigateBuildHelper, navigateTaskHelper } from 'utils/navigateHelper';
import { hasWritePermissions } from 'utils/permissions';
import { isTaskFinalStatus } from 'utils/status';
import { shorten } from 'utils/text';

import TaskCommandList from './TaskCommandList';
import TaskCommandsProgress from './TaskCommandsProgress';
import TaskDebuggingInformation from './TaskDebuggingInformation';
import TaskList from './TaskList';
import {
  TaskDetailsCancelMutation,
  TaskDetailsCancelMutation$variables,
} from './__generated__/TaskDetailsCancelMutation.graphql';
import {
  TaskDetailsInvalidateCachesMutation,
  TaskDetailsInvalidateCachesMutation$data,
  TaskDetailsInvalidateCachesMutation$variables,
} from './__generated__/TaskDetailsInvalidateCachesMutation.graphql';
import {
  TaskDetailsReRunMutation,
  TaskDetailsReRunMutation$data,
  TaskDetailsReRunMutation$variables,
} from './__generated__/TaskDetailsReRunMutation.graphql';
import {
  TaskDetailsTriggerMutation,
  TaskDetailsTriggerMutation$variables,
} from './__generated__/TaskDetailsTriggerMutation.graphql';
import { TaskDetails_task$key, TaskDetails_task$data } from './__generated__/TaskDetails_task.graphql';

const taskSubscription = graphql`
  subscription TaskDetailsSubscription($taskID: ID!) {
    task(id: $taskID) {
      ...TaskDetails_task
    }
  }
`;

const useStyles = mui.makeStyles(theme => {
  return {
    title: {
      padding: 8,
      background: theme.palette.action.disabledBackground,
    },
    gap: {
      paddingTop: 16,
    },
    buttonGap: {
      marginRight: 16,
    },
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginRight: 4,
    },
    wrapper: {
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
    },
    progress: {
      marginTop: theme.spacing(1.0),
    },
    automaticReRun: {
      backgroundColor: theme.palette.warning.light,
    },
    transaction: {
      backgroundColor: theme.palette.success.light,
    },
    taskLogOptions: {
      background: theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.light,
      padding: theme.spacing(2),
    },
    tabPanel: {
      padding: 0,
    },
    terminal: {
      width: '100%',
      height: '550px',
    },
    rerunOptionPopup: {
      zIndex: 1,
    },
  };
});

interface Props {
  task: TaskDetails_task$key;
}

export default function TaskDetails(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskDetails_task on Task {
        id
        localGroupId
        name
        buildId
        status
        triggerType
        automaticReRun
        ...TaskNameChip_task
        ...TaskCreatedChip_task
        ...TaskScheduledChip_task
        ...TaskStatusChip_task
        commands {
          name
        }
        ...TaskCommandsProgress_task
        ...TaskCommandList_task
        ...TaskArtifacts_task
        ...ArtifactsView_task
        ...TaskTransactionChip_task
        ...TaskOptionalChip_task
        ...TaskResourcesChip_task
        ...TaskExperimentalChip_task
        ...TaskTimeoutChip_task
        ...TaskStatefulChip_task
        ...TaskOptionalChip_task
        ...TaskRerunnerChip_task
        ...TaskCancellerChip_task
        labels
        artifacts {
          name
        }
        notifications {
          message
          ...Notification_notification
        }
        build {
          tasks {
            id
            localGroupId
            requiredGroups
          }
          branch
          changeIdInRepo
          changeMessageTitle
          viewerPermission
          ...BuildBranchNameChip_build
          ...BuildChangeChip_build
        }
        repository {
          cloneUrl
          ...RepositoryOwnerChip_repository
          ...RepositoryNameChip_repository
        }
        allOtherRuns {
          ...TaskList_tasks
        }
        dependencies {
          status
          ...TaskList_tasks
        }
        ...TaskExecutionInfo_task
        hooks {
          ...HookList_hooks
        }
        executionInfo {
          cacheRetrievalAttempts {
            hits {
              key
              valid
            }
          }
          agentNotifications {
            message
          }
        }
        terminalCredential {
          locator
          trustedSecret
        }
      }
    `,
    props.task,
  );
  let navigate = useNavigate();

  const isFinalStatus = useMemo(() => isTaskFinalStatus(task.status), [task.status]);
  useEffect(() => {
    if (isFinalStatus) {
      return;
    }

    let variables = { taskID: task.id };
    let subscription = requestSubscription(environment, {
      subscription: taskSubscription,
      variables: variables,
    });
    return () => subscription.dispose();
  }, [task.id, isFinalStatus]);

  let classes = useStyles();
  let build = task.build;
  let repository = task.repository;

  const [commitTaskReRunMutation] = useMutation<TaskDetailsReRunMutation>(graphql`
    mutation TaskDetailsReRunMutation($input: TasksReRunInput!) {
      batchReRun(input: $input) {
        newTasks {
          id
        }
      }
    }
  `);

  const [commitTaskTriggerMutation] = useMutation<TaskDetailsTriggerMutation>(
    graphql`
      mutation TaskDetailsTriggerMutation($input: TaskTriggerInput!) {
        trigger(input: $input) {
          task {
            id
            status
            triggerType
          }
        }
      }
    `,
  );

  const [commitTaskCancelMutation] = useMutation<TaskDetailsCancelMutation>(
    graphql`
      mutation TaskDetailsCancelMutation($input: TaskAbortInput!) {
        abortTask(input: $input) {
          abortedTask {
            id
            status
          }
        }
      }
    `,
  );

  const [commitInvalidateCachesMutation] = useMutation<TaskDetailsInvalidateCachesMutation>(graphql`
    mutation TaskDetailsInvalidateCachesMutation($input: InvalidateCacheEntriesInput!) {
      invalidateCacheEntries(input: $input) {
        clientMutationId
      }
    }
  `);

  function trigger(taskId) {
    const variables: TaskDetailsTriggerMutation$variables = {
      input: {
        clientMutationId: 'trigger-' + taskId,
        taskId: taskId,
      },
    };

    commitTaskTriggerMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function abort(taskId) {
    const variables: TaskDetailsCancelMutation$variables = {
      input: {
        clientMutationId: 'abort-' + taskId,
        taskId: taskId,
      },
    };

    commitTaskCancelMutation({
      variables: variables,
      onError: err => console.error(err),
    });
  }

  let notificationsComponent =
    !task.notifications || task.notifications.length === 0 ? null : (
      <mui.List>
        {task.notifications.map(notification => (
          <Notification key={notification.message} notification={notification} />
        ))}
      </mui.List>
    );

  let artifactsComponent =
    !task.artifacts || task.artifacts.length === 0 ? null : (
      <div className={classes.gap}>
        <TaskArtifacts task={task} />
      </div>
    );

  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [rerunOptionsShown, setRerunOptionsShown] = React.useState(false);
  const toggleRerunOptions = () => {
    setRerunOptionsShown(prevOpen => !prevOpen);
  };

  const closeRerunOptions = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setRerunOptionsShown(false);
  };

  function rerunCurrentTaskWithTraversal(reverse: boolean) {
    let graph = new graphlib.Graph();

    for (let buildTask of task.build.tasks) {
      graph.setNode(buildTask.localGroupId.toString(), buildTask.id);

      for (let requiredGroup of buildTask.requiredGroups) {
        if (reverse) {
          graph.setEdge(requiredGroup.toString(), buildTask.localGroupId.toString());
        } else {
          graph.setEdge(buildTask.localGroupId.toString(), requiredGroup.toString());
        }
      }
    }

    let taskIds: string[] = [];

    // Traverse the graph and retrieve a task ID for each node
    for (let node of graphlib.alg.preorder(graph, [task.localGroupId.toString()])) {
      taskIds.push(graph.node(node));
    }

    rerun(taskIds, false);
  }

  function rerun(taskIds: string[], withTerminalAccess: boolean) {
    const variables: TaskDetailsReRunMutation$variables = {
      input: {
        clientMutationId: 'rerun-' + taskIds[0],
        taskIds: taskIds,
        attachTerminal: withTerminalAccess,
      },
    };

    commitTaskReRunMutation({
      variables: variables,
      onCompleted: (response: TaskDetailsReRunMutation$data, errors) => {
        if (errors) {
          console.error(errors);
          return;
        }

        if (taskIds.length > 1) {
          navigateBuildHelper(navigate, null, task.buildId);
        } else {
          navigateTaskHelper(navigate, null, response.batchReRun.newTasks[0].id);
        }
      },
      onError: err => console.error(err),
    });
  }

  let reRunButton =
    !hasWritePermissions(build.viewerPermission) || !isFinalStatus ? null : (
      <>
        <mui.ButtonGroup variant="contained" ref={anchorRef}>
          <mui.Button onClick={() => rerun([task.id], false)} startIcon={<mui.icons.Refresh />}>
            Re-Run
          </mui.Button>
          <mui.Button size="small" onClick={toggleRerunOptions}>
            <mui.icons.ArrowDropDown />
          </mui.Button>
        </mui.ButtonGroup>
        <mui.Popper
          open={rerunOptionsShown}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.rerunOptionPopup}
        >
          {({ TransitionProps, placement }) => (
            <mui.Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <mui.Paper elevation={24}>
                <mui.ClickAwayListener onClickAway={closeRerunOptions}>
                  <mui.MenuList id="split-button-menu">
                    <mui.MenuItem onClick={() => rerun([task.id], true)}>Re-Run with Terminal Access</mui.MenuItem>
                    <mui.MenuItem onClick={() => rerunCurrentTaskWithTraversal(true)}>
                      Re-Run with Dependents
                    </mui.MenuItem>
                    <mui.MenuItem onClick={() => rerunCurrentTaskWithTraversal(false)}>
                      Re-Run with Dependencies
                    </mui.MenuItem>
                  </mui.MenuList>
                </mui.ClickAwayListener>
              </mui.Paper>
            </mui.Grow>
          )}
        </mui.Popper>
      </>
    );

  let allDependenciesInFinalStatus = !task.dependencies.find(task => !isTaskFinalStatus(task.status));
  let taskIsTriggerable = task.status === 'PAUSED' && (allDependenciesInFinalStatus || task.triggerType === 'MANUAL');
  let taskIsPreTriggerable = task.status === 'CREATED' && task.triggerType === 'MANUAL';
  let triggerButton =
    !hasWritePermissions(build.viewerPermission) || !taskIsTriggerable ? null : (
      <mui.Button variant="contained" onClick={() => trigger(task.id)} startIcon={<mui.icons.PlayCircleFilled />}>
        Trigger
      </mui.Button>
    );
  let preTriggerButton =
    !hasWritePermissions(build.viewerPermission) || !taskIsPreTriggerable ? null : (
      <mui.Button variant="contained" onClick={() => trigger(task.id)} startIcon={<mui.icons.PlayCircleFilled />}>
        Pre-Trigger
      </mui.Button>
    );

  let abortButton =
    isFinalStatus || !hasWritePermissions(build.viewerPermission) ? null : (
      <mui.Button variant="contained" onClick={() => abort(task.id)} startIcon={<mui.icons.Cancel />}>
        Cancel
      </mui.Button>
    );

  const [disableInvalidateCachesButton, setDisableInvalidateCachesButton] = React.useState(false);

  function validCacheKeys(task: TaskDetails_task$data) {
    if (task.executionInfo === null || task.executionInfo.cacheRetrievalAttempts === null) return [];

    return task.executionInfo.cacheRetrievalAttempts.hits
      .filter(hit => {
        return hit.valid;
      })
      .map(hit => {
        return hit.key;
      });
  }

  function invalidateCaches(task: TaskDetails_task$data) {
    let cacheKeys = validCacheKeys(task);

    if (cacheKeys.length === 0) return;

    const variables: TaskDetailsInvalidateCachesMutation$variables = {
      input: {
        clientMutationId: 'invalidate-caches-' + task.id,
        taskId: task.id,
        cacheKeys: cacheKeys,
      },
    };

    commitInvalidateCachesMutation({
      variables: variables,
      onCompleted: (response: TaskDetailsInvalidateCachesMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setDisableInvalidateCachesButton(true);
      },
      onError: err => console.error(err),
    });
  }

  let invalidateCachesButton =
    validCacheKeys(task).length === 0 || !hasWritePermissions(build.viewerPermission) ? null : (
      <mui.Tooltip title="Invalidate all cache entries referenced by this task">
        <mui.Button
          variant="contained"
          onClick={() => invalidateCaches(task)}
          startIcon={<mui.icons.LayersClear />}
          disabled={disableInvalidateCachesButton}
        >
          Clear Task Caches
        </mui.Button>
      </mui.Tooltip>
    );

  let allOtherRuns: JSX.Element | null = null;
  if (task.allOtherRuns && task.allOtherRuns.length > 0) {
    allOtherRuns = (
      <mui.Paper elevation={24}>
        <mui.Typography className={classes.title} variant="caption" gutterBottom display="block" align="center">
          All Other Runs
        </mui.Typography>
        <TaskList tasks={task.allOtherRuns} showCreation={true} />
      </mui.Paper>
    );
  }
  let dependencies: JSX.Element | null = null;
  if (task.dependencies && task.dependencies.length > 0) {
    dependencies = (
      <mui.Paper elevation={24}>
        <mui.Typography className={classes.title} variant="caption" gutterBottom display="block" align="center">
          Dependencies
        </mui.Typography>
        <TaskList tasks={task.dependencies} />
      </mui.Paper>
    );
  }

  let currentTab = useLocation().pathname.endsWith('/hooks') ? 'hooks' : 'instructions';

  const handleChange = (event, newValue) => {
    if (newValue === 'hooks') {
      navigate('/task/' + task.id + '/hooks');
    } else {
      navigate('/task/' + task.id);
    }
  };

  const [displayDebugInfo, setDisplayDebugInfo] = React.useState(false);
  const toggleDisplayDebugInfo = () => {
    setDisplayDebugInfo(!displayDebugInfo);
  };

  let taskLogOptions = <></>;

  // Task log options
  const [stripTimestamps, setStripTimestamps] = React.useState(false);

  const cirrusLogTimestamp = _.some(task.labels, function (label) {
    return _.isEqual(label.split(':'), ['CIRRUS_LOG_TIMESTAMP', 'true']);
  });

  if (cirrusLogTimestamp) {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStripTimestamps(!event.target.checked);
    };

    taskLogOptions = (
      <mui.Paper className={classes.taskLogOptions}>
        <mui.FormGroup>
          <mui.FormControlLabel
            control={<mui.Checkbox checked={!stripTimestamps} onChange={onChange} />}
            label="Display log timestamps"
          />
        </mui.FormGroup>
      </mui.Paper>
    );
  }

  const tabbedCommandsAndHooks = (
    <mui.TabContext value={currentTab}>
      <mui.TabList onChange={handleChange}>
        <mui.Tab
          icon={<mui.icons.Dehaze />}
          label={'Instructions (' + task.commands.length + ')'}
          value="instructions"
        />
        <mui.Tab icon={<mui.icons.Functions />} label={'Hooks (' + task.hooks.length + ')'} value="hooks" />
      </mui.TabList>
      {taskLogOptions}
      <mui.TabPanel value="instructions" className={classes.tabPanel}>
        <TaskCommandList task={task} stripTimestamps={stripTimestamps} />
      </mui.TabPanel>
      <mui.TabPanel value="hooks" className={classes.tabPanel}>
        <HookList hooks={task.hooks} type={HookType.Task} />
      </mui.TabPanel>
    </mui.TabContext>
  );

  function desiredLabel(label: string) {
    return !(label.startsWith('canceller_') || label.startsWith('rerunner_'));
  }

  const shouldRunTerminal = Boolean(task.terminalCredential && !isFinalStatus);

  useEffect(() => {
    const terminalElement = document.getElementById('terminal');
    if (!terminalElement) {
      console.error('Terminal element not found');
      return;
    }
    let ct = new CirrusTerminal(terminalElement);

    if (task.terminalCredential && !isFinalStatus) {
      ct.connect(
        'https://terminal.cirrus-ci.com',
        task.terminalCredential.locator,
        task.terminalCredential.trustedSecret,
      );
    }

    return () => {
      ct.dispose();
    };
  }, [isFinalStatus, task.terminalCredential]);

  let taskLabelsToShow = task.labels.filter(desiredLabel);
  let MAX_TASK_LABELS_TO_SHOW = 5;
  let [hideExtraLabels, setHideExtraLabels] = useState(taskLabelsToShow.length > MAX_TASK_LABELS_TO_SHOW);
  let taskLabels = taskLabelsToShow.map(label => {
    return (
      <mui.Tooltip key={label} title={label}>
        <mui.Chip className={classes.chip} label={shorten(label)} />
      </mui.Tooltip>
    );
  });
  if (hideExtraLabels) {
    taskLabels = taskLabels.slice(0, MAX_TASK_LABELS_TO_SHOW);
    taskLabels.push(
      <mui.Tooltip key="show-more" title="Show all labels">
        <mui.IconButton onClick={() => setHideExtraLabels(false)}>
          <mui.icons.ExpandMore sx={{ transform: 'rotate(-90deg)' }} />
        </mui.IconButton>
      </mui.Tooltip>,
    );
  }

  const hasNoAgentNotifications = task.executionInfo?.agentNotifications?.length === 0;

  useEffect(() => {
    document.title = `${task.name} - Cirrus CI`;
  }, [task.name]);

  return (
    <div>
      <CirrusFavicon status={task.status} />
      <mui.Card elevation={24}>
        <mui.CardContent>
          <div className={classes.wrapper}>
            <div className={classes.wrapper} style={{ flexGrow: 1 }}>
              <TaskCreatedChip className={classes.chip} task={task} />
              <TaskScheduledChip className={classes.chip} task={task} />
              <TaskStatusChip className={classes.chip} task={task} />
            </div>
            <mui.Tooltip title="Debugging View" sx={{ display: isFinalStatus ? { xs: 'none', sm: 'block' } : 'none' }}>
              <mui.Badge variant="dot" color="warning" invisible={hasNoAgentNotifications}>
                <mui.ToggleButton value="bug" onClick={toggleDisplayDebugInfo} selected={displayDebugInfo}>
                  <mui.icons.BugReport />
                </mui.ToggleButton>
              </mui.Badge>
            </mui.Tooltip>
          </div>
          <div className={classes.wrapper}>
            <TaskRerunnerChip className={classes.chip} task={task} />
            <TaskCancellerChip className={classes.chip} task={task} />
          </div>
          <div className={classes.gap} />
          <TaskCommandsProgress className={classes.progress} task={task} />
          <div className={classes.gap} />
          <CommitMessage
            cloneUrl={repository.cloneUrl}
            branch={build.branch}
            changeIdInRepo={build.changeIdInRepo}
            changeMessageTitle={build.changeMessageTitle}
          />
          <div className={classes.gap} />
          <div className={classNames('card-body', classes.wrapper)}>
            {task.automaticReRun ? (
              <mui.Chip className={classNames(classes.chip, classes.automaticReRun)} label="Automatic Re-Run" />
            ) : null}
            <TaskTransactionChip className={classes.chip} task={task} />
            <TaskOptionalChip className={classes.chip} task={task} />
            <TaskExperimentalChip className={classes.chip} task={task} />
            <TaskTimeoutChip className={classes.chip} task={task} />
            <TaskStatefulChip className={classes.chip} task={task} />
            <TaskResourcesChip className={classes.chip} task={task} />
            {taskLabels}
          </div>
          <ExecutionInfo task={task} />
        </mui.CardContent>
        <mui.CardActions sx={{ justifyContent: 'flex-end' }}>
          <mui.Button
            variant="contained"
            onClick={e => navigateBuildHelper(navigate, e, task.buildId)}
            startIcon={<mui.icons.ArrowBack />}
          >
            View All Tasks
          </mui.Button>
          {abortButton}
          {reRunButton}
          {triggerButton}
          {preTriggerButton}
          {invalidateCachesButton}
        </mui.CardActions>
      </mui.Card>
      {notificationsComponent}
      <mui.Collapse in={displayDebugInfo} unmountOnExit={true}>
        <div className={classes.gap} />
        <Suspense fallback={<CirrusLinearProgress />}>
          <TaskDebuggingInformation taskId={task.id} />
        </Suspense>
      </mui.Collapse>
      <mui.Collapse in={shouldRunTerminal}>
        <div className={classes.gap} />
        <mui.Accordion defaultExpanded={true}>
          <mui.AccordionSummary expandIcon={<mui.icons.ExpandMore />}>
            <mui.Typography variant="h6">Terminal</mui.Typography>
          </mui.AccordionSummary>
          <mui.AccordionDetails>
            <div id="terminal" className={classes.terminal} />
          </mui.AccordionDetails>
        </mui.Accordion>
      </mui.Collapse>
      {artifactsComponent}
      {dependencies && <div className={classes.gap} />}
      {dependencies}
      {allOtherRuns && <div className={classes.gap} />}
      {allOtherRuns}
      <div className={classes.gap} />
      <mui.Paper elevation={24}>{tabbedCommandsAndHooks}</mui.Paper>
    </div>
  );
}
