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

import { BuildCreatedChip_build$key } from './__generated__/BuildCreatedChip_build.graphql';

interface Props {
  build: BuildCreatedChip_build$key;
  className?: string;
}

export default function BuildCreatedChip(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildCreatedChip_build on Build {
        id
        buildCreatedTimestamp
      }
    `,
    props.build,
  );
  let theme = useTheme();

  const creationTimestamp = build.buildCreatedTimestamp;
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
