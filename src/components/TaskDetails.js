import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import environment from '../createRelayEnvironment';
import {commitMutation, createFragmentContainer, graphql, requestSubscription} from 'react-relay';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

import TaskCommandList from './TaskCommandList'
import TaskList from './TaskList';
import NotificationList from "./NotificationList";
import {isTaskFinalStatus} from "../utils/status";
import {Button, Icon, Typography, withStyles} from "material-ui";
import ReactMarkdown from 'react-markdown';
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

const taskReRunMutation = graphql`
  mutation TaskDetailsReRunMutation($input: TaskInput!) {
    rerun(input: $input) {
      newTask {
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
        level
        message
      }
    }
  }
`;

const styles = theme => ({
  main: {
    paddingTop: 8
  },
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
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ViewerTaskList extends React.Component {
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

    let notificationsComponent = (!task.notifications || task.notifications.length === 0) ? null :
      <div className={classes.gap}>
        <NotificationList notifications={task.notifications}/>
      </div>;

    let scheduledStatusDuration = task.statusDurations.find(it => it.status === 'SCHEDULED');
    let scheduledDurationChip = scheduledStatusDuration && task.status !== 'SCHEDULED'
      ? <TaskScheduledChip className={classes.chip} duration={scheduledStatusDuration.durationInSeconds}/>
      : null;

    let reRunButton = !hasWritePermissions(build.viewerPermission) ? null :
      <Button variant="raised"
              onTouchTap={() => this.rerun(task.id)}
              icon={<Icon>refresh</Icon>}
      >
        Re-Run
      </Button>;
    let previousRuns = [];
    if (task.previousRuns && task.previousRuns.length > 0) {
      previousRuns = [
        <div className={classes.gap}/>,
        <Paper>
          <Typography className={classes.title} variant="caption" gutterBottom align="center">Previous Runs</Typography>
          <TaskList tasks={task.previousRuns}/>
        </Paper>
      ]
    }
    let dependencies = [];
    if (task.dependencies && task.dependencies.length > 0) {
      dependencies = [
        <div className={classes.gap}/>,
        <Paper>
          <Typography className={classes.title} variant="caption" gutterBottom align="center">
            Dependencies
          </Typography>
          <TaskList tasks={task.dependencies}/>
        </Paper>
      ]
    }

    return (
      <div className={`container ${classes.main}`}>
        <Paper elevation={2}>
          <div className="card-block">
            <h4 className={`card-title text-middle ${classes.wrapper}`}>
              <RepositoryNameChip className={classes.chip} repository={repository}/>
              <BuildBranchNameChip className={classes.chip} build={build}/>
              <BuildChangeChip className={classes.chip} build={build}/>
              <TaskNameChip className={classes.chip} task={task}/>
              {scheduledDurationChip}
              <TaskStatusChip className={classes.chip} task={task}/>
            </h4>
            <TaskCommandsProgress task={task}/>
            <div className={classes.gap}>
              <ReactMarkdown className="card-text" source={build.changeMessage}/>
            </div>
            <div className={`card-body ${classes.wrapper}`}>
              {
                task.labels.map(label => {
                  return <Chip key={label} className={classes.chip} label={shorten(label)}/>
                })
              }
            </div>
            <div className="card-body text-right">
              <Button variant="raised"
                      color="primary"
                      className={classes.buttonGap}
                      onTouchTap={(e) => navigateBuild(this.context.router, e, task.buildId)}
              >
                <Icon className={classes.leftIcon}>input</Icon>
                View All Tasks
              </Button>
              {reRunButton}
            </div>
          </div>
        </Paper>
        {notificationsComponent}
        {dependencies}
        {previousRuns}
        <div className={classes.gap}/>
        <Paper elevation={2}>
          <TaskCommandList task={task} commands={task.commands}/>
        </Paper>
        <div className={classes.gap}/>
      </div>
    );
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
}

export default createFragmentContainer(withRouter(withStyles(styles)(ViewerTaskList)), {
  task: graphql`
    fragment TaskDetails_task on Task {
      id
      buildId
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
        level
        message
      }
      build {
        id
        repositoryId
        branch
        changeIdInRepo
        changeTimestamp
        changeMessage
        viewerPermission
      }
      repository {
        id
        owner
        name
      }
      previousRuns {
        ...TaskListRow_task
      }
      dependencies {
        ...TaskListRow_task
      }
    }
  `,
});
