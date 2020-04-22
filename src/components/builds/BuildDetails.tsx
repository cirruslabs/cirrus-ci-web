import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import { commitMutation, createFragmentContainer, Disposable, requestSubscription } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import environment from '../../createRelayEnvironment';
import { faviconColor } from '../../utils/colors';
import { hasWritePermissions } from '../../utils/permissions';
import BuildCreatedChip from '../chips/BuildCreatedChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import CirrusFavicon from '../common/CirrusFavicon';
import NotificationList from '../common/NotificationList';
import TaskList from '../tasks/TaskList';
import { BuildDetails_build } from './__generated__/BuildDetails_build.graphql';
import { Helmet as Head } from 'react-helmet';

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
  subscription BuildDetailsSubscription($buildID: ID!) {
    build(id: $buildID) {
      id
      durationInSeconds
      status
      notifications {
        ...Notification_notification
      }
      latestGroupTasks {
        id
        status
        ...TaskListRow_task
      }
    }
  }
`;

const taskBatchReRunMutation = graphql`
  mutation BuildDetailsReRunMutation($input: TasksReRunInput!) {
    batchReRun(input: $input) {
      newTasks {
        id
      }
    }
  }
`;

const styles = theme =>
  createStyles({
    gap: {
      paddingTop: 16,
    },
    title: {
      padding: 0,
    },
    repoButton: {
      padding: 0,
    },
    repoButtonIcon: {
      fontSize: 48,
    },
    leftIcon: {
      marginRight: theme.spacing(1.0),
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  build: BuildDetails_build;
}

class BuildDetails extends React.Component<Props> {
  subscription: Disposable;

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    let variables = { buildID: this.props.build.id };

    this.subscription = requestSubscription(environment, {
      subscription: buildSubscription,
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
    let { build, classes } = this.props;

    let repoUrl = build.repository.cloneUrl.slice(0, -4);
    let branchUrl = build.branch.startsWith('pull/') ? `${repoUrl}/${build.branch}` : `${repoUrl}/tree/${build.branch}`;
    let commitUrl = repoUrl + '/commit/' + build.changeIdInRepo;

    let notificationsComponent = !build.notifications ? null : (
      <div className={classes.gap}>
        <NotificationList notifications={build.notifications} />
      </div>
    );

    let canBeReTriggered =
      (build.status === 'FAILED' || build.status === 'ERRORED') &&
      hasWritePermissions(build.repository.viewerPermission) &&
      build.latestGroupTasks &&
      build.latestGroupTasks.length === 0;
    let reTriggerButton = !canBeReTriggered ? null : (
      <Button variant="contained" onClick={() => this.reTriggerBuild(build.id)}>
        <Icon className={classes.leftIcon}>refresh</Icon>
        Re-Trigger
      </Button>
    );

    let failedTaskIds = build.latestGroupTasks.filter(task => task.status === 'FAILED').map(task => task.id);
    let reRunAllTasksButton =
      failedTaskIds.length === 0 ? null : (
        <Button variant="contained" onClick={() => this.batchReRun(failedTaskIds)}>
          <Icon className={classes.leftIcon}>refresh</Icon>
          Re-Run Failed Tasks
        </Button>
      );

    let needsApproval = build.status === 'NEEDS_APPROVAL' && hasWritePermissions(build.repository.viewerPermission);
    let approveButton = !needsApproval ? null : (
      <Button variant="contained" onClick={() => this.approveBuild(build.id)}>
        <Icon className={classes.leftIcon}>check</Icon>
        Approve
      </Button>
    );

    return (
      <div>
        <CirrusFavicon color={faviconColor(build.status)} />
        <Head>
          <title>{build.changeMessageTitle} - Cirrus CI</title>
        </Head>
        <Paper elevation={2}>
          <Card>
            <CardContent>
              <div className={classes.wrapper}>
                <RepositoryNameChip className={classes.chip} repository={build.repository} />
                <BuildCreatedChip className={classes.chip} build={build} />
                <BuildStatusChip className={classes.chip} build={build} />
              </div>
              <div className={classes.gap} />
              <Typography variant="h6" gutterBottom>
                {build.changeMessageTitle}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Commit{' '}
                <a href={commitUrl} target="_blank" rel="noopener noreferrer">
                  {build.changeIdInRepo.substr(0, 6)}
                </a>{' '}
                on branch{' '}
                <a href={branchUrl} target="_blank" rel="noopener noreferrer">
                  {build.branch}
                </a>
                .
              </Typography>
            </CardContent>
            <CardActions className="d-flex flex-wrap justify-content-end">
              {reTriggerButton}
              {approveButton}
              {reRunAllTasksButton}
            </CardActions>
          </Card>
        </Paper>
        {notificationsComponent}
        <div className={classes.gap} />
        <Paper elevation={2}>
          <TaskList tasks={build.latestGroupTasks} />
        </Paper>
      </div>
    );
  }

  approveBuild(buildId) {
    const variables = {
      input: {
        clientMutationId: 'approve-build-' + buildId,
        buildId: buildId,
      },
    };

    commitMutation(environment, {
      mutation: buildApproveMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  reTriggerBuild(buildId) {
    const variables = {
      input: {
        clientMutationId: 're-trigger-build-' + buildId,
        buildId: buildId,
      },
    };

    commitMutation(environment, {
      mutation: buildReTriggerMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  batchReRun(taskIds) {
    const variables = {
      input: {
        clientMutationId: 'batch-rerun-' + this.props.build.id,
        taskIds: taskIds,
      },
      buildId: this.props.build.id,
    };

    commitMutation(environment, {
      mutation: taskBatchReRunMutation,
      variables: variables,
      onCompleted: () => this.forceUpdate(),
      onError: err => console.error(err),
    });
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(BuildDetails)), {
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
        id
        status
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
