import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import environment from '../createRelayEnvironment';
import {commitMutation, createFragmentContainer, graphql, requestSubscription} from 'react-relay';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import TaskCommandList from './TaskCommandList'
import TaskList from './TaskList';
import NotificationList from "./NotificationList";
import {isTaskFinalStatus} from "../utils/status";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import TaskNameChip from "./chips/TaskNameChip";
import BuildChangeChip from "./chips/BuildChangeChip";
import RepositoryNameChip from "./chips/RepositoryNameChip";
import TaskStatusChip from "./chips/TaskStatusChip";
import TaskCommandsProgress from "./TaskCommandsProgress";
import TaskScheduledChip from "./chips/TaskScheduledChip";
import {hasWritePermissions} from "../utils/permissions";
import {shorten} from "../utils/text";
import {navigateBuild, navigateTask} from "../utils/navigate";
import {cirrusColors} from "../cirrusTheme";
import TaskCreatedChip from "./chips/TaskCreatedChip";
import classNames from 'classnames';
import CirrusFavicon from "./CirrusFavicon";
import {faviconColor} from "../utils/colors";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TaskTransactionChip from "./chips/TaskTransactionChip";

const taskReRunMutation = graphql`
  mutation TaskDetailsReRunMutation($input: TaskInput!) {
    rerun(input: $input) {
      newTask {
        id
      }
    }
  }
`;

const taskCancelMutation = graphql`
  mutation TaskDetailsCancelMutation($input: TaskAbortInput!) {
    abortTask(input: $input) {
      abortedTask {
        id
      }
    }
  }
`;

const taskSubscription = graphql`
  subscription TaskDetailsSubscription(
    $taskID: ID!
  ) {
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

const styles = theme => ({
  title: {
    padding: 8,
    background: cirrusColors.cirrusGrey,
  },
  gap: {
    paddingTop: 16
  },
  buttonGap: {
    marginRight: 16
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
    marginTop: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  automaticReRun: {
    backgroundColor: cirrusColors.lightWarning,
  },
  transaction: {
    backgroundColor: cirrusColors.lightSuccess,
  },
});

class TaskDetails extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    if (isTaskFinalStatus(this.props.task.status)) {
      return
    }

    let variables = {taskID: this.props.task.id};

    this.subscription = requestSubscription(
      environment,
      {
        subscription: taskSubscription,
        variables: variables
      }
    );
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose()
  }

  render() {
    let {task, classes} = this.props;
    let build = task.build;
    let repository = task.repository;

    if (isTaskFinalStatus(task.status)) {
      // no need to be subscripted anymore
      this.closeSubscription();
    }

    let repoUrl = repository.cloneUrl.slice(0, -4);
    let commitUrl = repoUrl + "/commit/" + build.changeIdInRepo;

    let notificationsComponent = (!task.notifications || task.notifications.length === 0) ? null :
      <div className={classes.gap}>
        <NotificationList notifications={task.notifications}/>
      </div>;

    let reRunButton = !hasWritePermissions(build.viewerPermission) ? null :
      <Button variant="raised"
              onClick={() => this.rerun(task.id)}
      >
        <Icon className={classes.leftIcon}>refresh</Icon>
        Re-Run
      </Button>;

    let abortButton = isTaskFinalStatus(task.status) || !hasWritePermissions(build.viewerPermission) ? null :
      <Button variant="raised"
              onClick={() => this.abort(task.id)}
      >
        <Icon className={classes.leftIcon}>cancel</Icon>
        Cancel
      </Button>;
    let allOtherRuns = [];
    if (task.allOtherRuns && task.allOtherRuns.length > 0) {
      allOtherRuns = (
        <Paper>
          <Typography className={classes.title} variant="caption" gutterBottom align="center">All Other
            Runs</Typography>
          <TaskList tasks={task.allOtherRuns} showCreation={true}/>
        </Paper>
      );
    }
    let dependencies = [];
    if (task.dependencies && task.dependencies.length > 0) {
      dependencies = (
        <Paper>
          <Typography className={classes.title} variant="caption" gutterBottom align="center">
            Dependencies
          </Typography>
          <TaskList tasks={task.dependencies}/>
        </Paper>
      );
    }

    return (
      <div>
        <CirrusFavicon color={faviconColor(task.status)}/>
        <Paper elevation={2}>
          <Card>
            <CardContent>
              <div className={classes.wrapper}>
                <RepositoryNameChip className={classes.chip} repository={repository}/>
                <BuildBranchNameChip className={classes.chip} build={build}/>
                <BuildChangeChip className={classes.chip} build={build}/>
                <TaskNameChip className={classes.chip} task={task}/>
              </div>
              <div className={classes.wrapper}>
                <TaskCreatedChip className={classes.chip} task={task}/>
                <TaskScheduledChip className={classes.chip} task={task}/>
                <TaskStatusChip className={classes.chip} task={task}/>
              </div>
              <TaskCommandsProgress className={classes.progress} task={task}/>
              <div className={classes.gap}/>
              <Typography variant="title" gutterBottom>
                {build.changeMessageTitle} (commit <a href={commitUrl} target="_blank"
                                                      rel="noopener noreferrer">{build.changeIdInRepo.substr(0, 6)}</a>)
              </Typography>
              <div className={classes.gap}/>
              <div className={classNames("card-body", classes.wrapper)}>
                {task.automaticReRun ?
                  <Chip className={classNames(classes.chip, classes.automaticReRun)} label="Automatic Re-Run"/> : null}
                <TaskTransactionChip className={classes.chip} task={task}/>
                {
                  task.labels.map(label => {
                    return <Chip key={label} className={classes.chip} label={shorten(label)}/>
                  })
                }
              </div>
            </CardContent>
            <CardActions className="d-flex flex-wrap justify-content-end">
              <Button variant="raised"
                      color="primary"
                      onClick={(e) => navigateBuild(this.context.router, e, task.buildId)}
              >
                <Icon className={classes.leftIcon}>input</Icon>
                View All Tasks
              </Button>
              {abortButton}
              {reRunButton}
            </CardActions>
          </Card>
        </Paper>
        {notificationsComponent}
        {dependencies ? <div className={classes.gap}/> : null}
        {dependencies}
        {allOtherRuns ? <div className={classes.gap}/> : null}
        {allOtherRuns}
        <div className={classes.gap}/>
        <Paper elevation={2}>
          <TaskCommandList task={task} commands={task.commands}/>
        </Paper>
        <div className={classes.gap}/>
      </div>
    )
      ;
  }

  rerun(taskId) {
    const variables = {
      input: {
        clientMutationId: "rerun-" + taskId,
        taskId: taskId,
      },
    };

    commitMutation(
      environment,
      {
        mutation: taskReRunMutation,
        variables: variables,
        onCompleted: (response) => {
          navigateTask(this.context.router, null, response.rerun.newTask.id)
        },
        onError: err => console.error(err),
      },
    );
  }

  abort(taskId) {
    const variables = {
      input: {
        clientMutationId: "abort-" + taskId,
        taskId: taskId,
      },
    };

    commitMutation(
      environment,
      {
        mutation: taskCancelMutation,
        variables: variables,
        onCompleted: () => {
          this.forceUpdate()
        },
        onError: err => console.error(err),
      },
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(TaskDetails)), {
  task: graphql`
    fragment TaskDetails_task on Task {
      id
      buildId
      status
      automaticReRun
      ...TaskNameChip_task
      ...TaskCreatedChip_task
      ...TaskScheduledChip_task
      ...TaskStatusChip_task
      ...TaskCommandsProgress_task
      ...TaskCommandList_task
      ...TaskTransactionChip_task
      labels
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
        ...TaskListRow_task
      }
      dependencies {
        ...TaskListRow_task
      }
    }
  `,
});
