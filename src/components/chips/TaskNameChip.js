import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {cirrusColors} from "../../cirrusTheme";
import {createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';

function TaskNameChip(props) {
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

export default createFragmentContainer(TaskNameChip, {
  task: graphql`
    fragment TaskNameChip_task on Task {
      name
    }
  `,
});
