import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { commitMutation, createFragmentContainer, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { hasWritePermissions } from '../../utils/permissions';
import BuildCreatedChip from '../chips/BuildCreatedChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import CirrusFavicon from '../common/CirrusFavicon';
import TaskList from '../tasks/TaskList';
import { BuildDetails_build } from './__generated__/BuildDetails_build.graphql';
import { Helmet as Head } from 'react-helmet';
import Refresh from '@material-ui/icons/Refresh';
import Check from '@material-ui/icons/Check';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import Notification from '../common/Notification';
import classNames from 'classnames';
import ConfigurationWithIssues from './ConfigurationWithIssues';
import HookList from '../hooks/HookList';
import { TabContext, TabList, TabPanel, ToggleButton } from '@material-ui/lab';
import { AppBar, Collapse, Tab } from '@material-ui/core';
import { BugReport, Dehaze, Functions } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import DebuggingInformation from './DebuggingInformation';
import RepositoryOwnerChip from '../chips/RepositoryOwnerChip';
import { HookType } from '../hooks/HookType';

const buildApproveMutation = graphql`
  mutation BuildDetailsApproveBuildMutation($input: BuildApproveInput!) {
    approve(input: $input) {
      build {
        ...BuildDetails_build
      }
    }
  }
`;

const buildReTriggerMutation = graphql`
  mutation BuildDetailsReTriggerMutation($input: BuildReTriggerInput!) {
    retrigger(input: $input) {
      build {
        ...BuildDetails_build
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
        localGroupId
        requiredGroups
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
        build {
          ...BuildDetails_build
        }
      }
    }
  }
`;

const styles = theme =>
  createStyles({
    gap: {
      paddingTop: 16,
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
    tabPanel: {
      padding: 0,
    },
  });

interface Props extends WithStyles<typeof styles> {
  build: BuildDetails_build;
}

function BuildDetails(props: Props) {
  useEffect(() => {
    let variables = { buildID: props.build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.build.id]);
  let { build, classes } = props;

  function approveBuild() {
    const variables = {
      input: {
        clientMutationId: 'approve-build-' + build.id,
        buildId: build.id,
      },
    };

    commitMutation(environment, {
      mutation: buildApproveMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function reTriggerBuild() {
    const variables = {
      input: {
        clientMutationId: 're-trigger-build-' + build.id,
        buildId: build.id,
      },
    };

    commitMutation(environment, {
      mutation: buildReTriggerMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  function batchReRun(taskIds) {
    const variables = {
      input: {
        clientMutationId: 'batch-rerun-' + props.build.id,
        taskIds: taskIds,
      },
      buildId: props.build.id,
    };

    commitMutation(environment, {
      mutation: taskBatchReRunMutation,
      variables: variables,
      onError: err => console.error(err),
    });
  }

  let repoUrl = build.repository.cloneUrl.slice(0, -4);
  let branchUrl = build.branch.startsWith('pull/') ? `${repoUrl}/${build.branch}` : `${repoUrl}/tree/${build.branch}`;
  let commitUrl = repoUrl + '/commit/' + build.changeIdInRepo;

  let notificationsComponent = !build.notifications ? null : (
    <div className={classNames('container', classes.gap)}>
      {build.notifications.map(notification => (
        <Notification key={notification.message} notification={notification} />
      ))}
    </div>
  );

  let canBeReTriggered =
    (build.status === 'FAILED' || build.status === 'ERRORED') &&
    hasWritePermissions(build.repository.viewerPermission) &&
    build.latestGroupTasks &&
    build.latestGroupTasks.length === 0;
  let reTriggerButton = !canBeReTriggered ? null : (
    <Button variant="contained" onClick={() => reTriggerBuild()} startIcon={<Refresh />}>
      Re-Trigger
    </Button>
  );

  let failedTaskIds = build.latestGroupTasks
    .filter(task => task.status === 'FAILED' || (task.status === 'ABORTED' && task.requiredGroups.length === 0))
    .map(task => task.id);
  let reRunAllTasksButton =
    failedTaskIds.length === 0 || !hasWritePermissions(build.repository.viewerPermission) ? null : (
      <Button variant="contained" onClick={() => batchReRun(failedTaskIds)} startIcon={<Refresh />}>
        Re-Run Failed Tasks
      </Button>
    );

  let needsApproval = build.status === 'NEEDS_APPROVAL' && hasWritePermissions(build.repository.viewerPermission);
  let approveButton = !needsApproval ? null : (
    <Button variant="contained" onClick={() => approveBuild()} startIcon={<Check />}>
      Approve
    </Button>
  );

  const [currentTab, setCurrentTab] = React.useState('1');
  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const tabbedTasksAndHooks = (
    <TabContext value={currentTab}>
      <AppBar position="static">
        <TabList onChange={handleChange}>
          <Tab icon={<Dehaze />} label={'Tasks (' + build.latestGroupTasks.length + ')'} value="1" />
          <Tab icon={<Functions />} label={'Hooks (' + build.hooks.length + ')'} value="2" />
        </TabList>
      </AppBar>
      <TabPanel value="1" className={classes.tabPanel}>
        <TaskList tasks={build.latestGroupTasks} />
      </TabPanel>
      <TabPanel value="2" className={classes.tabPanel}>
        <HookList hooks={build.hooks} type={HookType.Build} />
      </TabPanel>
    </TabContext>
  );

  const [displayDebugInfo, setDisplayDebugInfo] = React.useState(false);
  const toggleDisplayDebugInfo = () => {
    setDisplayDebugInfo(!displayDebugInfo);
  };

  return (
    <div>
      <CirrusFavicon status={build.status} />
      <Head>
        <title>{build.changeMessageTitle} - Cirrus CI</title>
      </Head>
      <Card>
        <CardContent>
          <div className="d-flex justify-content-between">
            <div>
              <div className={classes.wrapper}>
                <RepositoryOwnerChip className={classes.chip} repository={build.repository} />
                <RepositoryNameChip className={classes.chip} repository={build.repository} />
                <BuildBranchNameChip className={classes.chip} build={build} />
              </div>
              <div className={classes.wrapper}>
                <BuildCreatedChip className={classes.chip} build={build} />
                <BuildStatusChip className={classes.chip} build={build} />
              </div>
            </div>
            <div>
              <Tooltip title="Debugging Information">
                <ToggleButton onClick={toggleDisplayDebugInfo} selected={displayDebugInfo}>
                  <BugReport />
                </ToggleButton>
              </Tooltip>
            </div>
          </div>
          <div className={classes.gap} />
          <Typography variant="h6" gutterBottom>
            {build.changeMessageTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Commit{' '}
            <a href={commitUrl} target="_blank" rel="noopener noreferrer">
              {build.changeIdInRepo.substr(0, 7)}
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
      <ConfigurationWithIssues build={build} />
      {notificationsComponent}
      <Collapse in={displayDebugInfo}>
        <DebuggingInformation build={build} />
      </Collapse>
      <div className={classes.gap} />
      <Paper elevation={2}>{tabbedTasksAndHooks}</Paper>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(BuildDetails), {
  build: graphql`
    fragment BuildDetails_build on Build {
      id
      branch
      status
      changeIdInRepo
      changeMessageTitle
      ...BuildCreatedChip_build
      ...BuildBranchNameChip_build
      ...BuildStatusChip_build
      notifications {
        message
        ...Notification_notification
      }
      ...ConfigurationWithIssues_build
      ...DebuggingInformation_build
      latestGroupTasks {
        id
        localGroupId
        requiredGroups
        scheduledTimestamp
        executingTimestamp
        finalStatusTimestamp
        status
        ...TaskListRow_task
      }
      repository {
        ...RepositoryOwnerChip_repository
        ...RepositoryNameChip_repository
        cloneUrl
        viewerPermission
      }
      hooks {
        timestamp
        ...HookListRow_hook
      }
    }
  `,
});
