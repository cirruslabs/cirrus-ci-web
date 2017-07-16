import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Paper from 'material-ui/Paper';

import TaskCommandList from './TaskCommandList'
import NotificationList from "./NotificationList";

class ViewerTaskList extends React.Component {
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
          <div className="card-block">
            <h4 className="card-title align-middle">
              Task {task.name}
            </h4>
            <p className="card-text">{task.status}</p>
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
}

export default createFragmentContainer(ViewerTaskList, {
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
