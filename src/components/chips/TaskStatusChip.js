import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName, taskStatusMessage} from "../../utils/status";

export default function (props) {
  let task = props.task;
  return (
    <Chip style={props.style}>
      <Avatar backgroundColor={taskStatusColor(task.status)}
              icon={<FontIcon className="material-icons">{taskStatusIconName(task.status)}</FontIcon>}/>
      {taskStatusMessage(task)}
    </Chip>
  );
}
