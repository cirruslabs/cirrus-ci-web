import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import {createFragmentContainer} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';
import {cirrusColors} from '../../cirrusTheme';
import {WithTheme, withTheme} from '@material-ui/core/styles';
import {WorkerStatusChip_worker} from './__generated__/WorkerStatusChip_worker.graphql';
import {Tooltip} from "@material-ui/core";
import PlatformIcon from "../icons/PlatformIcon";

interface Props extends WithTheme {
  className?: string;
  worker: WorkerStatusChip_worker;
}

let WorkerStatusChip = (props: Props) => {
  const {worker} = props;

  const durationAgoInSeconds = (Date.now() - worker.info.heartbeatTimestamp) / 1000;
  const offline = durationAgoInSeconds > 300; // 5 minutes no heartbeats

  let heartbeatTooltipMessage = `Last heartbeat was at ${new Date(worker.info.heartbeatTimestamp).toLocaleTimeString()} on ${new Date(worker.info.heartbeatTimestamp).toDateString()}`;
  return (
    <Tooltip title={heartbeatTooltipMessage}>
      <Chip
        className={props.className}
        label={worker.arch}
        avatar={
          <Avatar style={{backgroundColor: offline ? cirrusColors.warning : cirrusColors.success}}>
            <PlatformIcon platform={worker.os} style={{color: props.theme.palette.background.paper}}/>
          </Avatar>
        }
      />
    </Tooltip>
  );
};

export default createFragmentContainer(withTheme(WorkerStatusChip), {
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
