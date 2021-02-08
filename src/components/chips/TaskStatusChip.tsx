import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName, taskStatusMessage } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { withTheme } from '@material-ui/core/styles';
import { TaskStatusChip_task } from './__generated__/TaskStatusChip_task.graphql';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskStatusChip_task;
  className?: string;
}

function TaskStatusChip(props: Props) {
  let { task, className } = props;
  let theme = useTheme();
  let chip = (
    <Chip
      className={className}
      label={taskStatusMessage(task)}
      avatar={
        <Avatar style={{ backgroundColor: useTaskStatusColor(task.status) }}>
          <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName(task.status)}</Icon>
        </Avatar>
      }
    />
  );
  if (task.executingTimestamp && task.executingTimestamp > 0) {
    return (
      <Tooltip title={`Execution started at ${new Date(task.executingTimestamp).toLocaleTimeString()}`}>{chip}</Tooltip>
    );
  }
  return chip;
}

export default createFragmentContainer(withTheme(TaskStatusChip), {
  task: graphql`
    fragment TaskStatusChip_task on Task {
      status
      durationInSeconds
      executingTimestamp
    }
  `,
});
