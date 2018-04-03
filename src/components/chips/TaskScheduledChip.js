import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName} from "../../utils/status";
import {formatDuration} from "../../utils/time";
import {Icon} from "material-ui";
import {cirrusColors} from "../../cirrusTheme";

export default function (props) {
  return (
    <Tooltip title="Time it took to find available resources and start execution of this task." className={props.className}>
      <Chip label={`Scheduled in ${formatDuration(props.duration)}`}
            avatar={
              <Avatar style={{backgroundColor: taskStatusColor('SCHEDULED')}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName('SCHEDULED')}</Icon>
              </Avatar>
            }/>
    </Tooltip>
  );
}
