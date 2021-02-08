import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskStatusChipExtended_task } from './__generated__/TaskStatusChipExtended_task.graphql';
import { navigateTask } from '../../utils/navigate';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskStatusChipExtended_task;
  className?: string;
}

function TaskStatusChipExtended(props: Props) {
  let { task, className } = props;
  let history = useHistory();
  let theme = useTheme();
  let chip = (
    <Chip
      className={className}
      label={`${task.repository.owner}/${task.repository.name} "${task.name}"`}
      onClick={e => navigateTask(history, e, task.id)}
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

export default createFragmentContainer(TaskStatusChipExtended, {
  task: graphql`
    fragment TaskStatusChipExtended_task on Task {
      id
      name
      status
      durationInSeconds
      executingTimestamp
      repository {
        owner
        name
      }
    }
  `,
});
