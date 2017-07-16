import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Paper from 'material-ui/Paper';

import TaskList from './TaskList';
import NotificationList from "./NotificationList";

class ViewerBuildList extends React.Component {
  render() {
    let build = this.props.build;

    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
    };

    function runSummaryMessage(build) {
      return build.status;
    }

    let tasksComponent = build.tasks ? <TaskList tasks={build.tasks}/> : null;
    let notificationsComponent = !build.notifications ? null :
      <div style={styles.gap}>
        <NotificationList notifications={build.notifications}/>
      </div>;

    return (
      <div style={styles.main} className="container">
        <Paper zDepth={2} rounded={false}>
          <div className="card-block">
            <h4 className="card-title align-middle">
              Commit {build.changeIdInRepo.substr(0, 6)}
            </h4>
            <h6 className="card-subtitle mb-2 text-muted">{runSummaryMessage(build)}</h6>
            <p className="card-text">{build.changeMessage}</p>
          </div>
        </Paper>
        {notificationsComponent}
        <div style={styles.gap}/>
        <Paper zDepth={2} rounded={false}>
          {tasksComponent}
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(ViewerBuildList, {
  build: graphql`
    fragment BuildDetails_build on Build {
      id
      branch
      changeIdInRepo
      changeTimestamp
      changeMessage
      buildStartedTimestamp
      buildFinishedTimestamp
      status
      notifications {
        level
        message
      }
      tasks {
        id
        name
        status
      }
    }
  `,
});
