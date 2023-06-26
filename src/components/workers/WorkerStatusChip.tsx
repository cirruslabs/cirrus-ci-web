import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { Tooltip, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import PlatformIcon from 'components/icons/PlatformIcon';

import { WorkerStatusChip_worker$key } from './__generated__/WorkerStatusChip_worker.graphql';

interface Props {
  className?: string;
  worker: WorkerStatusChip_worker$key;
}

export default function WorkerStatusChip(props: Props) {
  let worker = useFragment(
    graphql`
      fragment WorkerStatusChip_worker on PersistentWorker {
        os
        arch
        info {
          heartbeatTimestamp
        }
      }
    `,
    props.worker,
  );

  let theme = useTheme();
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
}
