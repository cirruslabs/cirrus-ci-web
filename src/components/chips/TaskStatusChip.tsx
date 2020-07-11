import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { taskStatusColor } from '../../utils/colors';
import { taskStatusIconName, taskStatusMessage } from '../../utils/status';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithTheme, withTheme } from '@material-ui/core/styles';
import { TaskStatusChip_task } from './__generated__/TaskStatusChip_task.graphql';

interface Props extends WithTheme {
  task: TaskStatusChip_task;
  className?: string;
}

class TaskStatusChip extends React.Component<Props> {
  render() {
    let { task, className } = this.props;
    let chip = (
      <Chip
        className={className}
        label={taskStatusMessage(task)}
        avatar={
          <Avatar style={{ backgroundColor: taskStatusColor(task.status) }}>
            <Icon style={{ color: this.props.theme.palette.background.paper }}>{taskStatusIconName(task.status)}</Icon>
          </Avatar>
        }
      />
    );
    if (task.executingTimestamp && task.executingTimestamp > 0) {
      return (
        <Tooltip title={`Execution started at ${new Date(task.executingTimestamp).toLocaleTimeString()}`}>
          {chip}
        </Tooltip>
      );
    }
    return chip;
  }
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
