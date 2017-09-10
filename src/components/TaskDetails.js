import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import environment from '../createRelayEnvironment';
import {commitMutation, createFragmentContainer, graphql, requestSubscription} from 'react-relay';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

import TaskCommandList from './TaskCommandList'
import NotificationList from "./NotificationList";
import {isTaskFinalStatus} from "../utils/status";
import {FontIcon, RaisedButton} from "material-ui";
import {taskStatusColor} from "../utils/colors";
import ReactMarkdown from 'react-markdown';
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import TaskNameChip from "./chips/TaskNameChip";
import RepositoryNameChip from "./chips/RepositoryNameChip";

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
      ...TaskDetails_task
    }
  }
`;

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
    let task = this.props.task;
    let build = task.build;
    let repository = task.repository;

    if (isTaskFinalStatus(task.status)) {
      // no need to be subscripted anymore
      this.closeSubscription();
    }

    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
      chip: {
        marginTop: 4,
        marginBottom: 4,
        marginRight: 4,
      },
      wrapper: {
        paddingTop: 16,
        paddingLeft: 0,
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    let notificationsComponent = !task.notifications ? null :
      <div style={styles.gap}>
        <NotificationList notifications={task.notifications}/>
      </div>;

    let totalDuration = task.statusDurations.reduce(
      function(sum, statusDuration) { return sum + statusDuration.durationInSeconds },
      0
    );
    let taskProgress =  (
      <div className="progress">
        {task.statusDurations.map(statusDuration => {
          let percent = 100 * statusDuration.durationInSeconds / totalDuration;
          return <div className="progress-bar"
                      role="progressbar"
                      key={statusDuration.status}
                      style={{width: percent + '%', backgroundColor: taskStatusColor(statusDuration.status)}}
                      aria-valuenow={percent}
                      aria-valuemin="0"
                      aria-valuemax="100">{percent > 10 ? statusDuration.status : ""}</div>
        })}
      </div>
    );

    return (
      <div style={styles.main} className="container">
        <Paper zDepth={2} rounded={false}>
          <div className="card-block">
            <h4 className="card-title text-middle" style={styles.wrapper}>
              <RepositoryNameChip style={styles.chip} repository={repository} />
              <BuildBranchNameChip style={styles.chip} build={build}/>
              <TaskNameChip style={styles.chip} task={task}/>
            </h4>
            {taskProgress}
            <div style={styles.gap}>
              <ReactMarkdown className="card-text" source={build.changeMessage}/>
            </div>
            <div className="card-body" style={styles.wrapper}>
              {
                task.labels.map(label => {
                  return <Chip key={label} style={styles.chip}>{label}</Chip>
                })
              }
            </div>
            <div className="card-body text-right">
              <RaisedButton label="Re-Run"
                            primary={true}
                            onTouchTap={() => this.rerun(task.id)}
                            icon={<FontIcon className="material-icons">refresh</FontIcon>}
              />
            </div>
          </div>
        </Paper>
        {notificationsComponent}
        <div style={styles.gap}/>
        <Paper zDepth={2} rounded={false}>
          <TaskCommandList taskId={task.id} commands={task.commands}/>
        </Paper>
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
          this.context.router.history.push("/task/" + response.rerun.newTask.id)
        },
        onError: err => console.error(err),
      },
    );
  }
}

export default createFragmentContainer(withRouter(ViewerTaskList), {
  task: graphql`
    fragment TaskDetails_task on Task {
      id
      name
      status
      labels
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
        branch
        changeIdInRepo
        changeTimestamp
        changeMessage
      }
      repository {
        id
        owner
        name
      }
    }
  `,
});
