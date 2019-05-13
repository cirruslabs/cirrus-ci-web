import PropTypes from 'prop-types';
import React from 'react';
import {commitMutation, createFragmentContainer, requestSubscription,} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {withRouter} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import TaskList from './TaskList';
import NotificationList from "./NotificationList";
import environment from "../createRelayEnvironment";
import BuildStatusChip from "./chips/BuildStatusChip";
import RepositoryNameChip from "./chips/RepositoryNameChip";
import {hasWritePermissions} from "../utils/permissions";
import {withStyles} from "@material-ui/core";
import {cirrusColors} from "../cirrusTheme";
import BuildCreatedChip from "./chips/BuildCreatedChip";
import {faviconColor} from "../utils/colors";
import CirrusFavicon from "./CirrusFavicon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

const buildApproveMutation = graphql`
  mutation BuildDetailsApproveBuildMutation($input: BuildApproveInput!) {
    approve(input: $input) {
      build {
        id
        status
      }
    }
  }
`;

const buildReTriggerMutation = graphql`
  mutation BuildDetailsReTriggerMutation($input: BuildReTriggerInput!) {
    retrigger(input: $input) {
      build {
        id
        status
      }
    }
  }
`;

const buildSubscription = graphql`
  subscription BuildDetailsSubscription(
    $buildID: ID!
  ) {
    build(id: $buildID) {      
      id
      durationInSeconds
      status
      notifications {
        ...Notification_notification
      }
    }
  }
`;

const styles = theme => ({
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
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginRight: 4,
  },
  wrapper: {
    paddingLeft: 0,
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class BuildDetails extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    let variables = {buildID: this.props.build.id};

    this.subscription = requestSubscription(
      environment,
      {
        subscription: buildSubscription,
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
    let {build, classes} = this.props;

    let repoUrl = build.repository.cloneUrl.slice(0, -4);
    let branchUrl = build.branch.startsWith("pull/") ? `${repoUrl}/${build.branch}` : `${repoUrl}/tree/${build.branch}`;
    let commitUrl = repoUrl + "/commit/" + build.changeIdInRepo;

    let notificationsComponent = !build.notifications ? null :
      <div className={classes.gap}>
        <NotificationList notifications={build.notifications}/>
      </div>;

    let canBeReTriggered = (build.status === 'FAILED' || build.status === 'ERRORED')
      && hasWritePermissions(build.repository.viewerPermission)
      && build.latestGroupTasks && build.latestGroupTasks.length === 0;
    let reTriggerButton = !canBeReTriggered ? null :
      <Button variant="contained"
              backgroundColor={cirrusColors.success}
              onClick={() => this.reTriggerBuild(build.id)}>
        <Icon className={classes.leftIcon}>refresh</Icon>
        Re-Trigger
      </Button>;


    let needsApproval = build.status === 'NEEDS_APPROVAL' && hasWritePermissions(build.repository.viewerPermission);
    let approveButton = !needsApproval ? null :
      <Button variant="contained"
              backgroundColor={cirrusColors.success}
              onClick={() => this.approveBuild(build.id)}>
        <Icon className={classes.leftIcon}>check</Icon>
        Approve
      </Button>;

    return (
      <div>
        <CirrusFavicon color={faviconColor(build.status)}/>
        <Paper elevation={2}>
          <Card>
            <CardContent>
              <div className={classes.wrapper}>
                <RepositoryNameChip className={classes.chip} repository={build.repository}/>
                <BuildCreatedChip className={classes.chip} build={build}/>
                <BuildStatusChip className={classes.chip} build={build}/>
              </div>
              <div className={classes.gap}/>
              <Typography variant="h6" gutterBottom>
                {build.changeMessageTitle}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Commit <a href={commitUrl} target="_blank"
                          rel="noopener noreferrer">{build.changeIdInRepo.substr(0, 6)}</a> on branch <a
                href={branchUrl} target="_blank" rel="noopener noreferrer">{build.branch}</a>.
              </Typography>
            </CardContent>
            <CardActions className="d-flex flex-wrap justify-content-end">
              {reTriggerButton}
              {approveButton}
            </CardActions>
          </Card>
        </Paper>
        {notificationsComponent}
        <div className={classes.gap}/>
        <Paper elevation={2}>
          <TaskList tasks={build.latestGroupTasks}/>
        </Paper>
      </div>
    );
  }

  approveBuild(buildId) {
    const variables = {
      input: {
        clientMutationId: "approve-build-" + buildId,
        buildId: buildId,
      },
    };

    commitMutation(
      environment,
      {
        mutation: buildApproveMutation,
        variables: variables,
        onError: err => console.error(err),
      },
    );
  }

  reTriggerBuild(buildId) {
    const variables = {
      input: {
        clientMutationId: "re-trigger-build-" + buildId,
        buildId: buildId,
      },
    };

    commitMutation(
      environment,
      {
        mutation: buildReTriggerMutation,
        variables: variables,
        onError: err => console.error(err),
      },
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(BuildDetails)), {
  build: graphql`
    fragment BuildDetails_build on Build {
      id
      branch
      status
      changeIdInRepo
      changeMessageTitle
      ...BuildCreatedChip_build
      ...BuildStatusChip_build
      notifications {
        ...Notification_notification
      }
      latestGroupTasks {
        ...TaskListRow_task
      }
      repository {
        ...RepositoryNameChip_repository
        cloneUrl
        viewerPermission
      }
    }
  `,
});
