import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { taskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { roundAndPresentDuration } from '../../utils/time';
import { TaskCreatedChip_task } from './__generated__/TaskCreatedChip_task.graphql';
import { WithTheme, withTheme } from '@material-ui/core/styles';

interface Props extends WithTheme {
  task: TaskCreatedChip_task;
  className?: string;
}

let TaskCreatedChip = (props: Props) => {
  const creationTimestamp = props.task.creationTimestamp;
  const durationAgoInSeconds = (Date.now() - creationTimestamp) / 1000;

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  if (durationAgoInSeconds < 60) {
    // force update in a second
    setTimeout(() => forceUpdate(), 1000);
  } else {
    // force update in a minute
    setTimeout(() => forceUpdate(), 60 * 1000);
  }

  const durationInSeconds = Math.floor(durationAgoInSeconds);

  return (
    <Tooltip
      title={`Created at ${new Date(creationTimestamp).toLocaleTimeString()} on ${new Date(
        creationTimestamp,
      ).toDateString()}`}
    >
      <Chip
        className={props.className}
        label={`Created ${roundAndPresentDuration(durationInSeconds)} ago`}
        avatar={
          <Avatar style={{ backgroundColor: taskStatusColor('CREATED') }}>
            <Icon style={{ color: props.theme.palette.background.paper }}>{taskStatusIconName('CREATED')}</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
};

export default createFragmentContainer(withTheme(TaskCreatedChip), {
  task: graphql`
    fragment TaskCreatedChip_task on Task {
      creationTimestamp
    }
  `,
});
