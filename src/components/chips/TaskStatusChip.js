import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName, taskStatusMessage} from "../../utils/status";
import {cirrusColors} from "../../cirrusTheme";
import {createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import Tooltip from "@material-ui/core/Tooltip";

function TaskStatusChip(props) {
  let {task} = props;
  let chip = (
    <Chip className={props.className}
          label={taskStatusMessage(task)}
          avatar={
            <Avatar style={{backgroundColor: taskStatusColor(task.status)}}>
              <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName(task.status)}</Icon>
            </Avatar>
          }/>
  );
  if (task.executingTimestamp && task.executingTimestamp > 0) {
    return (
      <Tooltip title={`Execution started at ${new Date(task.executingTimestamp).toLocaleTimeString()}`}>
        {chip}
      </Tooltip>
    );
  }
  return chip
}

export default createFragmentContainer(TaskStatusChip, {
  task: graphql`
    fragment TaskStatusChip_task on Task {
      status
      durationInSeconds
      executingTimestamp
    }
  `,
});
