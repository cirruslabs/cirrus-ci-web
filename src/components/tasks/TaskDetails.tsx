import { makeStyles } from '@mui/styles';
import environment from '../../createRelayEnvironment';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';
import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useFragment, useMutation, requestSubscription } from 'react-relay';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateBuildHelper, navigateTaskHelper } from '../../utils/navigateHelper';
import { hasWritePermissions } from '../../utils/permissions';
import { isTaskFinalStatus } from '../../utils/status';
import { shorten } from '../../utils/text';
import TaskArtifacts from '../artifacts/TaskArtifacts';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import TaskOptionalChip from '../chips/TaskOptionalChip';
import TaskScheduledChip from '../chips/TaskScheduledChip';
import TaskStatusChip from '../chips/TaskStatusChip';
import TaskTransactionChip from '../chips/TaskTransactionChip';
import CirrusFavicon from '../common/CirrusFavicon';
import TaskCommandList from './TaskCommandList';
import TaskCommandsProgress from './TaskCommandsProgress';
import TaskList from './TaskList';
import { TaskDetails_task, TaskDetails_task$key } from './__generated__/TaskDetails_task.graphql';
import {
  TaskDetailsReRunMutation,
  TaskDetailsReRunMutationResponse,
  TaskDetailsReRunMutationVariables,
} from './__generated__/TaskDetailsReRunMutation.graphql';
import TaskResourcesChip from '../chips/TaskResourcesChip';
import { Helmet as Head } from 'react-helmet';
import ExecutionInfo from '../common/TaskExecutionInfo';
import Refresh from '@mui/icons-material/Refresh';
import PlayCircleFilled from '@mui/icons-material/PlayCircleFilled';
import Cancel from '@mui/icons-material/Cancel';
import ArrowBack from '@mui/icons-material/ArrowBack';
import TaskExperimentalChip from '../chips/TaskExperimentalChip';
import TaskStatefulChip from '../chips/TaskStatefulChip';
import TaskTimeoutChip from '../chips/TaskTimeoutChip';
import Notification from '../common/Notification';
import HookList from '../hooks/HookList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ToggleButton } from '@mui/material';
import {
  Badge,
  ButtonGroup,
  ClickAwayListener,
  Collapse,
  Grow,
  IconButton,
  List,
  MenuItem,
  MenuList,
  Popper,
  Tab,
  Tooltip,
} from '@mui/material';
import { BugReport, Dehaze, Functions, LayersClear } from '@mui/icons-material';
import {
  TaskDetailsInvalidateCachesMutation,
  TaskDetailsInvalidateCachesMutationResponse,
  TaskDetailsInvalidateCachesMutationVariables,
} from './__generated__/TaskDetailsInvalidateCachesMutation.graphql';
import TaskRerunnerChip from '../chips/TaskRerunnerChip';
import TaskCancellerChip from '../chips/TaskCancellerChip';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CirrusTerminal } from '../cirrus-terminal/CirrusTerminal';
import { HookType } from '../hooks/HookType';
import {
  TaskDetailsTriggerMutation,
  TaskDetailsTriggerMutationVariables,
} from './__generated__/TaskDetailsTriggerMutation.graphql';
import {
  TaskDetailsCancelMutation,
  TaskDetailsCancelMutationVariables,
} from './__generated__/TaskDetailsCancelMutation.graphql';
import TaskDebuggingInformation from './TaskDebuggingInformation';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import CommitMessage from '../common/CommitMessage';

const taskSubscription = graphql`
  subscription TaskDetailsSubscription($taskID: ID!) {
    task(id: $taskID) {
      ...TaskDetails_task
    }
  }
`;

const useStyles = makeStyles(theme => {
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
          id
          localGroupId
          requiredGroups
          scheduledTimestamp
          executingTimestamp
          finalStatusTimestamp
          ...TaskListRow_task
        }
        dependencies {
          id
          localGroupId
          requiredGroups
          scheduledTimestamp
          executingTimestamp
          finalStatusTimestamp
          ...TaskListRow_task
        }
        ...TaskExecutionInfo_task
        hooks {
          timestamp
          ...HookListRow_hook
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
    mutation TaskDetailsReRunMutation($input: TaskReRunInput!) {
      rerun(input: $input) {
        newTask {
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
    const variables: TaskDetailsTriggerMutationVariables = {
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
    const variables: TaskDetailsCancelMutationVariables = {
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
      <List>
        {task.notifications.map(notification => (
          <Notification key={notification.message} notification={notification} />
        ))}
      </List>
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

  function rerun(taskId: string, withTerminalAccess: boolean) {
    const variables: TaskDetailsReRunMutationVariables = {
      input: {
        clientMutationId: 'rerun-' + taskId,
        taskId: taskId,
        attachTerminal: withTerminalAccess,
      },
    };

    commitTaskReRunMutation({
      variables: variables,
      onCompleted: (response: TaskDetailsReRunMutationResponse, errors) => {
        if (errors) {
          console.error(errors);
          return;
        }
        navigateTaskHelper(navigate, null, response.rerun.newTask.id);
      },
      onError: err => console.error(err),
    });
  }

  let reRunButton =
    !hasWritePermissions(build.viewerPermission) || !isFinalStatus ? null : (
      <>
        <ButtonGroup variant="contained" ref={anchorRef}>
          <Button onClick={() => rerun(task.id, false)} startIcon={<Refresh />}>
            Re-Run
          </Button>
          <Button size="small" onClick={toggleRerunOptions}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={rerunOptionsShown}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          className={classes.rerunOptionPopup}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper elevation={24}>
                <ClickAwayListener onClickAway={closeRerunOptions}>
                  <MenuList id="split-button-menu">
                    <MenuItem onClick={() => rerun(task.id, true)}>Re-Run with Terminal Access</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );

  let taskIsTriggerable = task.status === 'PAUSED';
  let taskIsPreTriggerable = task.status === 'CREATED' && task.triggerType === 'MANUAL';
  let triggerButton =
    !hasWritePermissions(build.viewerPermission) || !taskIsTriggerable ? null : (
      <Button variant="contained" onClick={() => trigger(task.id)} startIcon={<PlayCircleFilled />}>
        Trigger
      </Button>
    );
  let preTriggerButton =
    !hasWritePermissions(build.viewerPermission) || !taskIsPreTriggerable ? null : (
      <Button variant="contained" onClick={() => trigger(task.id)} startIcon={<PlayCircleFilled />}>
        Pre-Trigger
      </Button>
    );

  let abortButton =
    isFinalStatus || !hasWritePermissions(build.viewerPermission) ? null : (
      <Button variant="contained" onClick={() => abort(task.id)} startIcon={<Cancel />}>
        Cancel
      </Button>
    );

  const [disableInvalidateCachesButton, setDisableInvalidateCachesButton] = React.useState(false);

  function validCacheKeys(task: TaskDetails_task) {
    if (task.executionInfo === null || task.executionInfo.cacheRetrievalAttempts === null) return [];

    return task.executionInfo.cacheRetrievalAttempts.hits
      .filter(hit => {
        return hit.valid;
      })
      .map(hit => {
        return hit.key;
      });
  }

  function invalidateCaches(task: TaskDetails_task) {
    let cacheKeys = validCacheKeys(task);

    if (cacheKeys.length === 0) return;

    const variables: TaskDetailsInvalidateCachesMutationVariables = {
      input: {
        clientMutationId: 'invalidate-caches-' + task.id,
        taskId: task.id,
        cacheKeys: cacheKeys,
      },
    };

    commitInvalidateCachesMutation({
      variables: variables,
      onCompleted: (response: TaskDetailsInvalidateCachesMutationResponse, errors) => {
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
      <Tooltip title="Invalidate all cache entries referenced by this task">
        <Button
          variant="contained"
          onClick={() => invalidateCaches(task)}
          startIcon={<LayersClear />}
          disabled={disableInvalidateCachesButton}
        >
          Clear Task Caches
        </Button>
      </Tooltip>
    );

  let allOtherRuns: JSX.Element | [] = [];
  if (task.allOtherRuns && task.allOtherRuns.length > 0) {
    allOtherRuns = (
      <Paper elevation={24}>
        <Typography className={classes.title} variant="caption" gutterBottom display="block" align="center">
          All Other Runs
        </Typography>
        <TaskList tasks={task.allOtherRuns} showCreation={true} />
      </Paper>
    );
  }
  let dependencies: JSX.Element | [] = [];
  if (task.dependencies && task.dependencies.length > 0) {
    dependencies = (
      <Paper elevation={24}>
        <Typography className={classes.title} variant="caption" gutterBottom display="block" align="center">
          Dependencies
        </Typography>
        <TaskList tasks={task.dependencies} />
      </Paper>
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

  const tabbedCommandsAndHooks = (
    <TabContext value={currentTab}>
      <TabList onChange={handleChange}>
        <Tab icon={<Dehaze />} label={'Instructions (' + task.commands.length + ')'} value="instructions" />
        <Tab icon={<Functions />} label={'Hooks (' + task.hooks.length + ')'} value="hooks" />
      </TabList>
      <TabPanel value="instructions" className={classes.tabPanel}>
        <TaskCommandList task={task} />
      </TabPanel>
      <TabPanel value="hooks" className={classes.tabPanel}>
        <HookList hooks={task.hooks} type={HookType.Task} />
      </TabPanel>
    </TabContext>
  );

  function desiredLabel(label: string) {
    return !(label.startsWith('canceller_') || label.startsWith('rerunner_'));
  }

  const shouldRunTerminal = task.terminalCredential != null && !isFinalStatus;

  useEffect(() => {
    let ct = new CirrusTerminal(document.getElementById('terminal'));

    if (shouldRunTerminal) {
      ct.connect(
        'https://terminal.cirrus-ci.com',
        task.terminalCredential.locator,
        task.terminalCredential.trustedSecret,
      );
    }

    return () => {
      ct.dispose();
    };
  }, [shouldRunTerminal, task.terminalCredential]);

  let taskLabelsToShow = task.labels.filter(desiredLabel);
  let MAX_TASK_LABELS_TO_SHOW = 5;
  let [hideExtraLabels, setHideExtraLabels] = useState(taskLabelsToShow.length > MAX_TASK_LABELS_TO_SHOW);
  let taskLabels = taskLabelsToShow.map(label => {
    return (
      <Tooltip key={label} title={label}>
        <Chip className={classes.chip} label={shorten(label)} />
      </Tooltip>
    );
  });
  if (hideExtraLabels) {
    taskLabels = taskLabels.slice(0, MAX_TASK_LABELS_TO_SHOW);
    taskLabels.push(
      <Tooltip key="show-more" title="Show all labels">
        <IconButton onClick={() => setHideExtraLabels(false)}>
          <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />
        </IconButton>
      </Tooltip>,
    );
  }

  const hasNoAgentNotifications = task.executionInfo?.agentNotifications?.length === 0;

  return (
    <div>
      <Head>
        <title>{task.name} - Cirrus CI</title>
      </Head>
      <CirrusFavicon status={task.status} />
      <Card elevation={24}>
        <CardContent>
          <div className={classes.wrapper}>
            <div className={classes.wrapper} style={{ flexGrow: 1 }}>
              <TaskCreatedChip className={classes.chip} task={task} />
              <TaskScheduledChip className={classes.chip} task={task} />
              <TaskStatusChip className={classes.chip} task={task} />
            </div>
            <Tooltip title="Debugging View" sx={{ display: isFinalStatus ? null : 'none' }}>
              <Badge variant="dot" color="warning" invisible={hasNoAgentNotifications}>
                <ToggleButton value="bug" onClick={toggleDisplayDebugInfo} selected={displayDebugInfo}>
                  <BugReport />
                </ToggleButton>
              </Badge>
            </Tooltip>
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
              <Chip className={classNames(classes.chip, classes.automaticReRun)} label="Automatic Re-Run" />
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
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={e => navigateBuildHelper(navigate, e, task.buildId)}
            startIcon={<ArrowBack />}
          >
            View All Tasks
          </Button>
          {abortButton}
          {reRunButton}
          {triggerButton}
          {preTriggerButton}
          {invalidateCachesButton}
        </CardActions>
      </Card>
      {notificationsComponent}
      <Collapse in={displayDebugInfo} unmountOnExit={true}>
        <div className={classes.gap} />
        <Suspense fallback={<CirrusLinearProgress />}>
          <TaskDebuggingInformation taskId={task.id} />
        </Suspense>
      </Collapse>
      <Collapse in={shouldRunTerminal}>
        <div className={classes.gap} />
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Terminal</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div id="terminal" className={classes.terminal} />
          </AccordionDetails>
        </Accordion>
      </Collapse>
      {artifactsComponent}
      {dependencies ? <div className={classes.gap} /> : null}
      {dependencies}
      {allOtherRuns ? <div className={classes.gap} /> : null}
      {allOtherRuns}
      <div className={classes.gap} />
      <Paper elevation={24}>{tabbedCommandsAndHooks}</Paper>
    </div>
  );
}
