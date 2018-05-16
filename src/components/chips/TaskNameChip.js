import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {cirrusColors} from "../../cirrusTheme";

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
