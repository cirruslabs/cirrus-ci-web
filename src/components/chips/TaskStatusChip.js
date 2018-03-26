import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName, taskStatusMessage} from "../../utils/status";
import {Icon} from "material-ui";
import {cirrusColors} from "../../cirrusTheme";

export default function (props) {
  let task = props.task;
  return (
    <Chip className={props.className}
          label={taskStatusMessage(task)}
          avatar={
            <Avatar style={{backgroundColor: taskStatusColor(task.status)}}>
              <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName(task.status)}</Icon>
            </Avatar>
          }/>
  );
}
