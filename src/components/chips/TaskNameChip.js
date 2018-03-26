import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {cirrusColors} from "../../cirrusTheme";
import {Icon} from "material-ui";

export default function (props) {
  let task = props.task;
  return (
    <Chip className={props.className}
          label={task.name}
          avatar={
            <Avatar style={{backgroundColor: cirrusColors.cirrusPrimary}}>
              <Icon style={{color: cirrusColors.cirrusWhite}}>bookmark</Icon>
            </Avatar>
          }/>
  );
}
