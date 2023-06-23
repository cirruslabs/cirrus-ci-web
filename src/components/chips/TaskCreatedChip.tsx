import React, { useEffect } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';

import { useTaskStatusColor } from 'utils/colors';
import { taskStatusIconName } from 'utils/status';
import { roundAndPresentDuration } from 'utils/time';

import { TaskCreatedChip_task$key } from './__generated__/TaskCreatedChip_task.graphql';

interface Props {
  task: TaskCreatedChip_task$key;
  className?: string;
}

export default function TaskCreatedChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskCreatedChip_task on Task {
        creationTimestamp
      }
    `,
    props.task,
  );

  let theme = useTheme();
  const creationTimestamp = task.creationTimestamp;

  const [durationAgoInSeconds, setDurationAgoInSeconds] = React.useState((Date.now() - creationTimestamp) / 1000);

  useEffect(() => {
    const timeoutId = setInterval(
      () => {
        setDurationAgoInSeconds((Date.now() - creationTimestamp) / 1000);
      },
      durationAgoInSeconds < 60 ? 1_000 : 60_000,
    );
    return () => clearInterval(timeoutId);
  }, [durationAgoInSeconds, creationTimestamp]);

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
          <Avatar style={{ backgroundColor: useTaskStatusColor('CREATED') }}>
            <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName('CREATED')}</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
}
