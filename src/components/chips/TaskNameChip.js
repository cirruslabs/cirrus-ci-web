import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {cirrusColors} from "../../cirrusTheme";

export default function (props) {
  let task = props.task;
  return (
    <Chip style={props.style}>
      <Avatar backgroundColor={cirrusColors.cirrusPrimary}
              icon={<FontIcon className="material-icons">bookmark</FontIcon>}/>
      {task.name}
    </Chip>
  );
}
