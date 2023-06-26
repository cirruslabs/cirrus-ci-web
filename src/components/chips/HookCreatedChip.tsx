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

import { HookCreatedChip_hook$key } from './__generated__/HookCreatedChip_hook.graphql';

interface Props {
  hook: HookCreatedChip_hook$key;
  className?: string;
}

export default function HookCreatedChip(props: Props) {
  let hook = useFragment(
    graphql`
      fragment HookCreatedChip_hook on Hook {
        id
        timestamp
      }
    `,
    props.hook,
  );

  let theme = useTheme();

  const creationTimestamp = hook.timestamp;
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
