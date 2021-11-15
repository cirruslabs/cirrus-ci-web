import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WorkerStatusChip_worker } from './__generated__/WorkerStatusChip_worker.graphql';
import { Tooltip, useTheme } from '@mui/material';
import PlatformIcon from '../icons/PlatformIcon';

interface Props {
  className?: string;
  worker: WorkerStatusChip_worker;
}

let WorkerStatusChip = (props: Props) => {
  let theme = useTheme();
  const { worker } = props;
  let info = worker.info;

  let offline = true;
  let heartbeatTooltipMessage = "Haven't yet received a heartbeat from the agent";

  if (info) {
    const durationAgoInSeconds = (Date.now() - info.heartbeatTimestamp) / 1000;
    offline = durationAgoInSeconds > 300; // 5 minutes no heartbeats
    heartbeatTooltipMessage = `Last heartbeat was at ${new Date(
      info.heartbeatTimestamp,
    ).toLocaleTimeString()} on ${new Date(info.heartbeatTimestamp).toDateString()}`;
  }
  return (
    <Tooltip title={heartbeatTooltipMessage}>
      <Chip
        className={props.className}
        label={worker.arch}
        avatar={
          <Avatar style={{ backgroundColor: offline ? theme.palette.warning.main : theme.palette.success.main }}>
            <PlatformIcon platform={worker.os} style={{ color: theme.palette.primary.contrastText }} />
          </Avatar>
        }
      />
    </Tooltip>
  );
};

export default createFragmentContainer(WorkerStatusChip, {
  worker: graphql`
    fragment WorkerStatusChip_worker on PersistentWorker {
      os
      arch
      info {
        heartbeatTimestamp
      }
    }
  `,
});
