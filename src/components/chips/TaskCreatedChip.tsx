import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '../common/CirrusTooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { cirrusColors } from '../../cirrusTheme';
import { taskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { roundAndPresentDuration } from '../../utils/time';
import { TaskCreatedChip_task } from './__generated__/TaskCreatedChip_task.graphql';

interface Props {
  task: TaskCreatedChip_task;
  className?: string;
}

class TaskCreatedChip extends React.Component<Props> {
  render() {
    let creationTimestamp = this.props.task.creationTimestamp;
    let durationAgoInSeconds = (Date.now() - creationTimestamp) / 1000;
    if (durationAgoInSeconds < 60) {
      // force update in a second
      setTimeout(() => this.forceUpdate(), 1000);
    } else {
      // force update in a minute
      setTimeout(() => this.forceUpdate(), 60 * 1000);
    }
    let durationInSeconds = Math.floor(durationAgoInSeconds);
    return (
      <Tooltip
        title={`Created at ${new Date(creationTimestamp).toLocaleTimeString()} on ${new Date(
          creationTimestamp,
        ).toDateString()}`}
      >
        <Chip
          className={this.props.className}
          label={`Created ${roundAndPresentDuration(durationInSeconds)} ago`}
          avatar={
            <Avatar style={{ backgroundColor: taskStatusColor('CREATED') }}>
              <Icon style={{ color: cirrusColors.cirrusWhite }}>{taskStatusIconName('CREATED')}</Icon>
            </Avatar>
          }
        />
      </Tooltip>
    );
  }
}

export default createFragmentContainer(TaskCreatedChip, {
  task: graphql`
    fragment TaskCreatedChip_task on Task {
      creationTimestamp
    }
  `,
});
