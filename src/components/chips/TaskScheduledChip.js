import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName} from "../../utils/status";
import {formatDuration} from "../../utils/time";
import {cirrusColors} from "../../cirrusTheme";

export default function (props) {
  return (
    <Tooltip title="Time it took to find available resources and start execution of this task.">
      <Chip className={props.className}
            label={`Scheduled in ${formatDuration(props.duration)}`}
            avatar={
              <Avatar style={{backgroundColor: taskStatusColor('SCHEDULED')}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName('SCHEDULED')}</Icon>
              </Avatar>
            }/>
    </Tooltip>
  );
}
