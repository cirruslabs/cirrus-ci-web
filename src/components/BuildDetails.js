import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {withRouter} from 'react-router-dom'
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import TaskList from './TaskList';
import NotificationList from "./NotificationList";
import {formatDuration} from "../utils/time";

class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let build = this.props.build;

    let styles = {
      main: {
        paddingTop: 8
      },
      gap: {
        paddingTop: 16
      },
      title: {
        padding: 0
      },
      repoButton: {
        padding: 0
      },
      repoButtonIcon: {
        fontSize: 48
      }
    };

    function runSummaryMessage(build) {
      return build.status + " in " + formatDuration(build.buildDurationInSeconds);
    }

    let repoUrl = build.repository.cloneUrl.slice(0, -4);
    let branchUrl = repoUrl + "/tree/" + build.branch;
    let commitUrl = repoUrl + "/commit/" + build.changeIdInRepo;

    let repoIcon = <IconButton href={repoUrl}
                               iconClassName="fa fa-github text-middle"
                               style={styles.repoButton}
                               iconStyle={styles.repoButtonIcon}
                               disableTouchRipple={true}
                               tooltip="Navigate to GitHub"/>;
    let repoTitle = <a onClick={() => this.context.router.history.push("/repository/" + build.repository.id)}
                       style={{ cursor: "pointer" }}>{build.repository.fullName}</a>;

    let tasksComponent = build.tasks ? <TaskList tasks={build.tasks}/> : null;
    let notificationsComponent = !build.notifications ? null :
      <div style={styles.gap}>
        <NotificationList notifications={build.notifications}/>
      </div>;

    return (
      <div style={styles.main} className="container">
        <Paper zDepth={2} rounded={false}>
          <div className="card-block">
            <h4 className="card-title text-middle" style={styles.title}>
              {repoIcon} {repoTitle}
            </h4>
            <h5 className="card-title align-middle">
              Commit <a href={commitUrl}>{build.changeIdInRepo.substr(0, 6)}</a> on branch <a href={branchUrl}>{build.branch}</a>
            </h5>
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

export default createFragmentContainer(withRouter(ViewerBuildList), {
  build: graphql`
    fragment BuildDetails_build on Build {
      id
      branch
      changeIdInRepo
      changeTimestamp
      changeMessage
      buildDurationInSeconds
      status
      notifications {
        level
        message
      }
      tasks {
        id
        name
        status
        taskDurationInSeconds
      }
      repository {
        id
        fullName
        cloneUrl
      }
    }
  `,
});
