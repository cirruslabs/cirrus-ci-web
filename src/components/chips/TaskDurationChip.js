import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {taskStatusColor} from "../../utils/colors";
import {formatDuration} from "../../utils/time";
import {isTaskFinalStatus, taskStatusIconName} from "../../utils/status";

class TaskDurationChip extends React.Component {
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
