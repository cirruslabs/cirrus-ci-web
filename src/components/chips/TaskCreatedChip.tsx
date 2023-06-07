import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect, useMemo, useState } from 'react';
import { useFragment } from 'react-relay';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { roundAndPresentDuration } from '../../utils/time';
import { TaskCreatedChip_task$key } from './__generated__/TaskCreatedChip_task.graphql';
import { useTheme } from '@mui/material';

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

  const [durationAgoInSeconds, setDurationAgoInSeconds] = useState(
    creationTimestamp ? (Date.now() - creationTimestamp) / 1000 : 0,
  );

  useEffect(() => {
    if (!creationTimestamp) return;
    const timeoutId = setInterval(
      () => {
        setDurationAgoInSeconds((Date.now() - creationTimestamp) / 1000);
      },
      durationAgoInSeconds < 60 ? 1_000 : 60_000,
    );
    return () => clearInterval(timeoutId);
  }, [durationAgoInSeconds, creationTimestamp]);

  const tooltip = useMemo(() => {
    if (!creationTimestamp) return '';
    const time = new Date(creationTimestamp).toLocaleTimeString();
    const date = new Date(creationTimestamp).toDateString();
    return `Created at ${time} on ${date}`;
  }, [creationTimestamp]);

  const label = useMemo(() => {
    if (!creationTimestamp) return 'Created';
    const durationInSeconds = Math.floor(durationAgoInSeconds);
    return `Created ${roundAndPresentDuration(durationInSeconds)} ago`;
  }, [durationAgoInSeconds, creationTimestamp]);

  return (
    <Tooltip title={tooltip}>
      <Chip
        className={props.className}
        label={label}
        avatar={
          <Avatar style={{ backgroundColor: useTaskStatusColor('CREATED') }}>
            <Icon style={{ color: theme.palette.primary.contrastText }}>{taskStatusIconName('CREATED')}</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
}
