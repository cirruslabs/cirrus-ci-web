import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {taskStatusColor} from "../../utils/colors";
import {formatDuration} from "../../utils/time";
import {isTaskFinalStatus, taskStatusIconName} from "../../utils/status";
import {graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";

const taskSubscription = graphql`
  subscription TaskDurationChipSubscription(
    $taskID: ID!
  ) {
    task(id: $taskID) {
      id
      status
      creationTimestamp
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
    if (!isTaskFinalStatus(task.status)) {
      durationInSeconds = (Date.now() - task.creationTimestamp) / 1000;
      setTimeout(() => this.forceUpdate(), 1000);
    }
    return (
      <Chip style={this.props.style}>
        <Avatar backgroundColor={taskStatusColor(task.status)}
                icon={<FontIcon className="material-icons">{taskStatusIconName(task.status)}</FontIcon>}/>
        {formatDuration(durationInSeconds)}
      </Chip>
    );
  }
}

export default TaskDurationChip
