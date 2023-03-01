import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName, taskStatusMessage } from '../../utils/status';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskStatusChip_task$key } from './__generated__/TaskStatusChip_task.graphql';
import { useTheme } from '@mui/material';

interface Props {
  task: TaskStatusChip_task$key;
  className?: string;
}

export default function TaskStatusChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskStatusChip_task on Task {
        status
        durationInSeconds
        executingTimestamp
      }
    `,
    props.task,
  );

  let { className } = props;
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
