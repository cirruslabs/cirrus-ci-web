import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { TaskScheduledChip_task } from './__generated__/TaskScheduledChip_task.graphql';
import { useTheme } from '@mui/material';

interface Props {
  task: TaskScheduledChip_task;
  className?: string;
}

function TaskScheduledChip(props: Props) {
  let theme = useTheme();
  let { task, className } = props;
  let scheduledColor = useTaskStatusColor('SCHEDULED');

  let scheduledStatusDuration = task.statusDurations.find(it => it.status === 'SCHEDULED');
  if (scheduledStatusDuration && task.status !== 'SCHEDULED') {
    return (
      <Tooltip title="Time it took to find available resources and start execution of this task.">
        <Chip
          className={className}
          label={`Scheduled in ${formatDuration(scheduledStatusDuration.durationInSeconds)}`}
          avatar={
            <Avatar style={{ backgroundColor: scheduledColor }}>
              <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName('SCHEDULED')}</Icon>
            </Avatar>
          }
        />
      </Tooltip>
    );
  }
  return <div />;
}

export default createFragmentContainer(TaskScheduledChip, {
  task: graphql`
    fragment TaskScheduledChip_task on Task {
      status
      statusDurations {
        status
        durationInSeconds
      }
    }
  `,
});
