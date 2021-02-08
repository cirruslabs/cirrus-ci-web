import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import TimerIcon from '@material-ui/icons/Timer';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColorsState } from '../../cirrusTheme';
import { formatDuration } from '../../utils/time';
import { withTheme } from '@material-ui/core/styles';
import { TaskTimeoutChip_task } from './__generated__/TaskTimeoutChip_task.graphql';
import { createFragmentContainer } from 'react-relay';
import { useRecoilValue } from 'recoil';

interface Props {
  task: TaskTimeoutChip_task;
  className?: string;
}

function TaskTimeoutChip(props: Props) {
  const cirrusColors = useRecoilValue(cirrusColorsState);

  let { timeoutInSeconds } = props.task;
  let defaultTimeout = timeoutInSeconds === 3600; // 1 hour
  if (defaultTimeout) return <div />;

  return (
    <Tooltip title="Custom Timeout">
      <Chip
        className={this.props.className}
        label={formatDuration(timeoutInSeconds)}
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <TimerIcon style={{ color: this.props.theme.palette.primary.contrastText }} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(withTheme(TaskTimeoutChip), {
  task: graphql`
    fragment TaskTimeoutChip_task on Task {
      timeoutInSeconds
    }
  `,
});
