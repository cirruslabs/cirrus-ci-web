import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer, Disposable, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { taskStatusColor } from '../../utils/colors';
import { isTaskFinalStatus, isTaskInProgressStatus, taskStatusIconName } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { TaskDurationChip_task } from './__generated__/TaskDurationChip_task.graphql';
import { WithTheme, withTheme } from '@material-ui/core/styles';

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription($taskID: ID!) {
    task(id: $taskID) {
      ...TaskDurationChip_task
    }
  }
`;

interface Props extends WithTheme {
  task: TaskDurationChip_task;
  className?: string;
}

class TaskDurationChip extends React.Component<Props> {
  subscription: Disposable;

  componentDidMount() {
    if (isTaskFinalStatus(this.props.task.status)) {
      return;
    }

    let variables = { taskID: this.props.task.id };

    this.subscription = requestSubscription(environment, {
      subscription: taskSubscription,
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
    let { task, className } = this.props;
    let durationInSeconds = task.durationInSeconds;
    if (!isTaskInProgressStatus(task.status) && !isTaskFinalStatus(task.status)) {
      durationInSeconds = 0;
    } else if (!isTaskFinalStatus(task.status)) {
      let timestamp = Math.max(task.creationTimestamp, task.scheduledTimestamp, task.executingTimestamp);
      durationInSeconds = (Date.now() - timestamp) / 1000;
    }

    if (!isTaskFinalStatus(task.status)) {
      setTimeout(() => this.forceUpdate(), 1000);
    }
    return (
      <Chip
        className={className}
        label={formatDuration(durationInSeconds)}
        avatar={
          <Avatar style={{ background: taskStatusColor(task.status) }}>
            <Icon style={{ color: this.props.theme.palette.background.paper }}>{taskStatusIconName(task.status)}</Icon>
          </Avatar>
        }
      />
    );
  }
}

export default createFragmentContainer(withTheme(TaskDurationChip), {
  task: graphql`
    fragment TaskDurationChip_task on Task {
      id
      status
      creationTimestamp
      scheduledTimestamp
      executingTimestamp
      durationInSeconds
    }
  `,
});
