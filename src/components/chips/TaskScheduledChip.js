import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName} from "../../utils/status";
import {formatDuration} from "../../utils/time";

export default function (props) {
  return (
    <Chip style={props.style}>
      <Avatar backgroundColor={taskStatusColor('SCHEDULED')}
              icon={<FontIcon className="material-icons">{taskStatusIconName('SCHEDULED')}</FontIcon>}/>
      Scheduled in {formatDuration(props.duration)}
    </Chip>
  );
}
