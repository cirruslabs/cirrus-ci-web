import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import environment from '../createRelayEnvironment';
import {commitMutation, createFragmentContainer, graphql, requestSubscription} from 'react-relay';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import TaskCommandList from './TaskCommandList'
import NotificationList from "./NotificationList";

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
    this.subscription && this.subscription.dispose && this.subscription.dispose()
  }

  render() {
    let task = this.props.task;

    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
    };

    let notificationsComponent = !task.notifications ? null :
      <div style={styles.gap}>
        <NotificationList notifications={task.notifications}/>
      </div>;

    return (
      <div style={styles.main} className="container">
        <Paper zDepth={2} rounded={false}>
          <Card>
            <CardHeader
              title={"Task " + task.name}
              subtitle={task.status}
              actAsExpander={false}
            />
            <CardActions>
              <FlatButton label="Re-run" onTouchTap={() => this.rerun(task.id)}/>
            </CardActions>
          </Card>
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
  `,
});
