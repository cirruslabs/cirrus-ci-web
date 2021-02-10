import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import TimerIcon from '@material-ui/icons/Timer';
import { graphql } from 'babel-plugin-relay/macro';
import { formatDuration } from '../../utils/time';
import { TaskTimeoutChip_task } from './__generated__/TaskTimeoutChip_task.graphql';
import { createFragmentContainer } from 'react-relay';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskTimeoutChip_task;
  className?: string;
}

function TaskTimeoutChip(props: Props) {
  let theme = useTheme();

  let { timeoutInSeconds } = props.task;
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

export default createFragmentContainer(TaskTimeoutChip, {
  task: graphql`
    fragment TaskTimeoutChip_task on Task {
      timeoutInSeconds
    }
  `,
});
