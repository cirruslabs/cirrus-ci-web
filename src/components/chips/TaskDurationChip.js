import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {taskStatusColor} from "../../utils/colors";
import {formatDuration} from "../../utils/time";

export default function (props) {
  let task = props.task;
  return (
    <Chip style={props.style}>
      <Avatar backgroundColor={taskStatusColor(task.status)}
              icon={<FontIcon className="material-icons">query_builder</FontIcon>}/>
      {formatDuration(task.taskDurationInSeconds)}
    </Chip>
  );
}
