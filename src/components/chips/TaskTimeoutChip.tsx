import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import TimerIcon from '@mui/icons-material/Timer';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

import { formatDuration } from 'utils/time';

import { TaskTimeoutChip_task$key } from './__generated__/TaskTimeoutChip_task.graphql';

interface Props {
  task: TaskTimeoutChip_task$key;
  className?: string;
}

export default function TaskTimeoutChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskTimeoutChip_task on Task {
        timeoutInSeconds
      }
    `,
    props.task,
  );

  let theme = useTheme();

  let { timeoutInSeconds } = task;
  let defaultTimeout = timeoutInSeconds === 3600; // 1 hour
  if (defaultTimeout) return <div />;

  return (
    <Tooltip title="Custom Timeout">
      <Chip
        className={props.className}
        label={formatDuration(timeoutInSeconds)}
        avatar={
          <Avatar style={{ backgroundColor: theme.palette.info.main }}>
            <TimerIcon style={{ color: theme.palette.primary.contrastText }} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}
