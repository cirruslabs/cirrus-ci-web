import React from 'react';

import { useFragment } from 'react-relay';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskStatusChipExtended_task$key } from './__generated__/TaskStatusChipExtended_task.graphql';
import { navigateTaskHelper } from '../../utils/navigateHelper';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';

interface Props {
  task: TaskStatusChipExtended_task$key;
  className?: string;
  key?: string;
}

export default function TaskStatusChipExtended(props: Props) {
  let task = useFragment(
    graphql`
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
    props.task,
  );
  let { className, key } = props;
  let navigate = useNavigate();
  let theme = useTheme();
  let hasExecutingTimestamp = task.executingTimestamp && task.executingTimestamp > 0;

  let chip = (
    <Chip
      className={className}
      key={!hasExecutingTimestamp ? key : null}
      label={`${task.repository.owner}/${task.repository.name} "${task.name}"`}
      onClick={e => navigateTaskHelper(navigate, e, task.id)}
      onAuxClick={e => navigateTaskHelper(navigate, e, task.id)}
      avatar={
        <Avatar style={{ backgroundColor: useTaskStatusColor(task.status) }}>
          <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName(task.status)}</Icon>
        </Avatar>
      }
    />
  );
  if (hasExecutingTimestamp) {
    return (
      <Tooltip key={key} title={`Execution started at ${new Date(task.executingTimestamp).toLocaleTimeString()}`}>
        {chip}
      </Tooltip>
    );
  }
  return chip;
}
