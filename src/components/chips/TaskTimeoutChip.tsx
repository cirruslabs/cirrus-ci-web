import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import TimerIcon from '@material-ui/icons/Timer';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';
import { formatDuration } from '../../utils/time';
import { Tooltip } from '@material-ui/core';

function TaskTimeoutChip(props) {
  let { task } = props;
  let { timeoutInSeconds } = task;
  let defaultTimeout = timeoutInSeconds === 3600; // 1 hour
  if (defaultTimeout) return <div />;
  return (
    <Tooltip title="Custom Timeout">
      <Chip
        className={props.className}
        label={formatDuration(timeoutInSeconds)}
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <TimerIcon style={{ color: cirrusColors.cirrusWhite }} />
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
