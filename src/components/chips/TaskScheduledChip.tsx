import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { taskStatusColor } from '../../utils/colors';
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

class TaskScheduledChip extends React.Component<Props> {
  render() {
    let { task, className } = this.props;
    let scheduledStatusDuration = task.statusDurations.find(it => it.status === 'SCHEDULED');
    if (scheduledStatusDuration && task.status !== 'SCHEDULED') {
      return (
        <Tooltip title="Time it took to find available resources and start execution of this task.">
          <Chip
            className={className}
            label={`Scheduled in ${formatDuration(scheduledStatusDuration.durationInSeconds)}`}
            avatar={
              <Avatar style={{ backgroundColor: taskStatusColor('SCHEDULED') }}>
                <Icon style={{ color: this.props.theme.palette.background.paper }}>
                  {taskStatusIconName('SCHEDULED')}
                </Icon>
              </Avatar>
            }
          />
        </Tooltip>
      );
    }
    return <div />;
  }
}

export default createFragmentContainer(withTheme(TaskScheduledChip), {
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
