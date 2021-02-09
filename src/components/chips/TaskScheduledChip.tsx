import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { TaskScheduledChip_task } from './__generated__/TaskScheduledChip_task.graphql';

interface Props extends WithTheme {
  task: TaskScheduledChip_task;
  className?: string;
}

function TaskScheduledChip(props: Props) {
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
              <Icon style={{ color: props.theme.palette.primary.contrastText }}>{taskStatusIconName('SCHEDULED')}</Icon>
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
