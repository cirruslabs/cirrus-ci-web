import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName, taskStatusMessage} from "../../utils/status";
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
