import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {taskStatusColor} from "../../utils/colors";
import {formatDuration} from "../../utils/time";
import {isTaskFinalStatus, isTaskInProgressStatus, taskStatusIconName} from "../../utils/status";
import {graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";
import {Icon} from "material-ui";
import {cirrusColors} from "../../cirrusTheme";

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription(
    $taskID: ID!
  ) {
    task(id: $taskID) {
      id
      status
      scheduledTimestamp
      durationInSeconds
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
      durationInSeconds = (Date.now() - task.scheduledTimestamp) / 1000;
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

export default TaskDurationChip
