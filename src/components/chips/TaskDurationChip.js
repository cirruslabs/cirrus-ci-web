import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {taskStatusColor} from "../../utils/colors";
import {formatDuration} from "../../utils/time";
import {isTaskFinalStatus, isTaskInProgressStatus, taskStatusIconName} from "../../utils/status";
import {createFragmentContainer, graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";
import {cirrusColors} from "../../cirrusTheme";

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription(
    $taskID: ID!
  ) {
    task(id: $taskID) {
      ...TaskDurationChip_task
    }
  }
`;

class TaskDurationChip extends React.Component {
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
    let durationInSeconds = task.durationInSeconds;
    if (!isTaskInProgressStatus(task.status) && !isTaskFinalStatus(task.status)) {
      durationInSeconds = 0
    } else if (!isTaskFinalStatus(task.status)) {
      let timestamp = Math.max(task.creationTimestamp, task.scheduledTimestamp, task.executingTimestamp);
      durationInSeconds = (Date.now() - timestamp) / 1000;
    }

    if (!isTaskFinalStatus(task.status)) {
      setTimeout(() => this.forceUpdate(), 1000);
    }
    return (
      <Chip className={this.props.className}
            label={formatDuration(durationInSeconds)}
            avatar={
              <Avatar style={{background: taskStatusColor(task.status)}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName(task.status)}</Icon>
              </Avatar>
            }/>
    );
  }
}

export default createFragmentContainer(TaskDurationChip, {
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
