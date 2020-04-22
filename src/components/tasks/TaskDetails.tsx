import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { commitMutation, createFragmentContainer, Disposable, requestSubscription } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { cirrusColors } from '../../cirrusTheme';
import environment from '../../createRelayEnvironment';
import { faviconColor } from '../../utils/colors';
import { navigateBuild, navigateTask } from '../../utils/navigate';
import { hasWritePermissions } from '../../utils/permissions';
import { isTaskFinalStatus } from '../../utils/status';
import { shorten } from '../../utils/text';
import TaskArtifacts from '../artifacts/TaskArtifacts';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import TaskNameChip from '../chips/TaskNameChip';
import TaskOptionalChip from '../chips/TaskOptionalChip';
import TaskScheduledChip from '../chips/TaskScheduledChip';
import TaskStatusChip from '../chips/TaskStatusChip';
import TaskTransactionChip from '../chips/TaskTransactionChip';
import CirrusFavicon from '../common/CirrusFavicon';
import NotificationList from '../common/NotificationList';
import TaskCommandList from './TaskCommandList';
import TaskCommandsProgress from './TaskCommandsProgress';
import TaskList from './TaskList';
import { TaskDetails_task } from './__generated__/TaskDetails_task.graphql';
import { TaskDetailsReRunMutationResponse } from './__generated__/TaskDetailsReRunMutation.graphql';
import TaskResourcesChip from '../chips/TaskResourcesChip';
import { Helmet as Head } from 'react-helmet';
import ExecutionInfo from '../common/ExecutionInfo';

const taskReRunMutation = graphql`
  mutation TaskDetailsReRunMutation($input: TaskReRunInput!) {
    rerun(input: $input) {
      newTask {
        id
      }
    }
  }
`;

const taskTriggerMutation = graphql`
  mutation TaskDetailsTriggerMutation($input: TaskTriggerInput!) {
    trigger(input: $input) {
      task {
        id
        status
        triggerType
      }
    }
  }
`;

const taskCancelMutation = graphql`
  mutation TaskDetailsCancelMutation($input: TaskAbortInput!) {
    abortTask(input: $input) {
      abortedTask {
        id
        status
      }
    }
  }
`;

const taskSubscription = graphql`
  subscription TaskDetailsSubscription($taskID: ID!) {
    task(id: $taskID) {
      id
      name
      status
      labels
      creationTimestamp
      executingTimestamp
      durationInSeconds
      statusDurations {
        status
        durationInSeconds
      }
      commands {
        name
        status
        durationInSeconds
      }
      notifications {
        ...Notification_notification
      }
    }
  }
`;

const styles = theme =>
  createStyles({
    title: {
      padding: 8,
      background: cirrusColors.cirrusGrey,
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
    button: {
      margin: theme.spacing(1.0),
    },
    leftIcon: {
      marginRight: theme.spacing(1.0),
    },
    automaticReRun: {
      backgroundColor: cirrusColors.lightWarning,
    },
    transaction: {
      backgroundColor: cirrusColors.lightSuccess,
    },
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  task: TaskDetails_task;
}

class TaskDetails extends React.Component<Props> {
  subscription: Disposable;

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    if (isTaskFinalStatus(this.props.task.status)) {
      return;
    }

    let variables = { taskID: this.props.task.id };

    this.subscription = requestSubscription(environment, {
      subscription: taskSubscription,
      variables: variables,
    });
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose();
  }

  render() {
    let { task, classes } = this.props;
    let build = task.build;
    let repository = task.repository;

    if (isTaskFinalStatus(task.status)) {
      // no need to be subscribed anymore
      this.closeSubscription();
    }

    let repoUrl = repository.cloneUrl.slice(0, -4);
    let commitUrl = repoUrl + '/commit/' + build.changeIdInRepo;

    let notificationsComponent =
      !task.notifications || task.notifications.length === 0 ? null : (
        <div className={classes.gap}>
          <NotificationList notifications={task.notifications} />
        </div>
      );

    let artifactsComponent =
      !task.artifacts || task.artifacts.length === 0 ? null : (
        <div className={classes.gap}>
          <TaskArtifacts task={task} />
        </div>
      );

    let reRunButton =
      !hasWritePermissions(build.viewerPermission) || !isTaskFinalStatus(task.status) ? null : (
        <Button variant="contained" onClick={() => this.rerun(task.id)}>
          <Icon className={classes.leftIcon}>refresh</Icon>
          Re-Run
        </Button>
      );

    let taskIsTriggerable = task.status === 'PAUSED';
    let taskIsPreTriggerable = task.status === 'CREATED' && task.triggerType === 'MANUAL';
    let triggerButton =
      !hasWritePermissions(build.viewerPermission) || !taskIsTriggerable ? null : (
        <Button variant="contained" onClick={() => this.trigger(task.id)}>
          <Icon className={classes.leftIcon}>play_circle_filled</Icon>
          Trigger
        </Button>
      );
    let preTriggerButton =
      !hasWritePermissions(build.viewerPermission) || !taskIsPreTriggerable ? null : (
        <Button variant="contained" onClick={() => this.trigger(task.id)}>
          <Icon className={classes.leftIcon}>play_circle_filled</Icon>
          Pre-Trigger
        </Button>
      );

    let abortButton =
      isTaskFinalStatus(task.status) || !hasWritePermissions(build.viewerPermission) ? null : (
        <Button variant="contained" onClick={() => this.abort(task.id)}>
          <Icon className={classes.leftIcon}>cancel</Icon>
          Cancel
        </Button>
      );
    let allOtherRuns: JSX.Element | [] = [];
    if (task.allOtherRuns && task.allOtherRuns.length > 0) {
      allOtherRuns = (
        <Paper>
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
        <Paper>
          <Typography className={classes.title} variant="caption" gutterBottom display="block" align="center">
            Dependencies
          </Typography>
          <TaskList tasks={task.dependencies} />
        </Paper>
      );
    }

    return (
      <div>
        <Head>
          <title>{task.name} - Cirrus CI</title>
        </Head>
        <CirrusFavicon color={faviconColor(task.status)} />
        <Paper elevation={2}>
          <Card>
            <CardContent>
              <div className={classes.wrapper}>
                <RepositoryNameChip className={classes.chip} repository={repository} />
                <BuildBranchNameChip className={classes.chip} build={build} />
                <BuildChangeChip className={classes.chip} build={build} />
                <TaskNameChip className={classes.chip} task={task} />
              </div>
              <div className={classes.wrapper}>
                <TaskCreatedChip className={classes.chip} task={task} />
                <TaskScheduledChip className={classes.chip} task={task} />
                <TaskStatusChip className={classes.chip} task={task} />
              </div>
              <TaskCommandsProgress className={classes.progress} task={task} />
              <div className={classes.gap} />
              <Typography variant="h6" gutterBottom>
                {build.changeMessageTitle} (commit{' '}
                <a href={commitUrl} target="_blank" rel="noopener noreferrer">
                  {build.changeIdInRepo.substr(0, 6)}
                </a>
                )
              </Typography>
              <div className={classes.gap} />
              <div className={classNames('card-body', classes.wrapper)}>
                {task.automaticReRun ? (
                  <Chip className={classNames(classes.chip, classes.automaticReRun)} label="Automatic Re-Run" />
                ) : null}
                <TaskTransactionChip className={classes.chip} task={task} />
                <TaskOptionalChip className={classes.chip} task={task} />
                <TaskResourcesChip className={classes.chip} task={task} />
                {task.labels.map(label => {
                  return <Chip key={label} className={classes.chip} label={shorten(label)} />;
                })}
              </div>
              {task.executionInfo ? <ExecutionInfo info={task.executionInfo} /> : null}
            </CardContent>
            <CardActions className="d-flex flex-wrap justify-content-end">
              <Button
                variant="contained"
                color="primary"
                onClick={e => navigateBuild(this.context.router, e, task.buildId)}
              >
                <Icon className={classes.leftIcon}>input</Icon>
                View All Tasks
              </Button>
              {abortButton}
              {reRunButton}
              {triggerButton}
              {preTriggerButton}
            </CardActions>
          </Card>
        </Paper>
        {notificationsComponent}
        {artifactsComponent}
        {dependencies ? <div className={classes.gap} /> : null}
        {dependencies}
        {allOtherRuns ? <div className={classes.gap} /> : null}
        {allOtherRuns}
        <div className={classes.gap} />
        <Paper elevation={2}>
          <TaskCommandList task={task} />
        </Paper>
        <div className={classes.gap} />
      </div>
    );
  }

  rerun(taskId) {
    const variables = {
      input: {
        clientMutationId: 'rerun-' + taskId,
        taskId: taskId,
      },
    };

    commitMutation(environment, {
      mutation: taskReRunMutation,
      variables: variables,
      onCompleted: (response: TaskDetailsReRunMutationResponse) => {
        navigateTask(this.context.router, null, response.rerun.newTask.id);
      },
      onError: err => console.error(err),
    });
  }

  trigger(taskId) {
    const variables = {
      input: {
        clientMutationId: 'trigger-' + taskId,
        taskId: taskId,
      },
    };

    commitMutation(environment, {
      mutation: taskTriggerMutation,
      variables: variables,
      onCompleted: () => this.forceUpdate(),
      onError: err => console.error(err),
    });
  }

  abort(taskId) {
    const variables = {
      input: {
        clientMutationId: 'abort-' + taskId,
        taskId: taskId,
      },
    };

    commitMutation(environment, {
      mutation: taskCancelMutation,
      variables: variables,
      onCompleted: () => {
        this.forceUpdate();
      },
      onError: err => console.error(err),
    });
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(TaskDetails)), {
  task: graphql`
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
      ...TaskCommandsProgress_task
      ...TaskCommandList_task
      ...TaskArtifacts_task
      ...TaskTransactionChip_task
      ...TaskOptionalChip_task
      ...TaskResourcesChip_task
      labels
      artifacts {
        name
      }
      notifications {
        ...Notification_notification
      }
      build {
        changeIdInRepo
        changeMessageTitle
        viewerPermission
        ...BuildBranchNameChip_build
        ...BuildChangeChip_build
      }
      repository {
        cloneUrl
        ...RepositoryNameChip_repository
      }
      allOtherRuns {
        id
        ...TaskListRow_task
      }
      dependencies {
        id
        ...TaskListRow_task
      }
      executionInfo {
        ...ExecutionInfo_info
      }
    }
  `,
});
