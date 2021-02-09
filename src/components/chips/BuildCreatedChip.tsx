import React, { useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { useTaskStatusColor } from '../../utils/colors';
import { taskStatusIconName } from '../../utils/status';
import { roundAndPresentDuration } from '../../utils/time';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { BuildCreatedChip_build } from './__generated__/BuildCreatedChip_build.graphql';
import { WithTheme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core';

interface Props extends WithTheme {
  build: BuildCreatedChip_build;
  className?: string;
}

let BuildCreatedChip = (props: Props) => {
  let theme = useTheme();

  const creationTimestamp = props.build.buildCreatedTimestamp;
  const [durationAgoInSeconds, setDurationAgoInSeconds] = React.useState((Date.now() - creationTimestamp) / 1000);

  useEffect(() => {
    const timeoutId = setInterval(
      () => {
        setDurationAgoInSeconds((Date.now() - creationTimestamp) / 1000);
      },
      durationAgoInSeconds < 60 ? 1_000 : 60_000,
    );
    return () => clearInterval(timeoutId);
  }, [durationAgoInSeconds]);
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
};

export default createFragmentContainer(BuildCreatedChip, {
  build: graphql`
    fragment BuildCreatedChip_build on Build {
      id
      buildCreatedTimestamp
    }
  `,
});
