import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect } from 'react';
import { createFragmentContainer, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { useBuildStatusColor } from '../../utils/colors';
import { buildStatusIconName, buildStatusMessage, isBuildFinalStatus } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { BuildStatusChip_build } from './__generated__/BuildStatusChip_build.graphql';
import { useTheme } from '@mui/material';

const buildSubscription = graphql`
  subscription BuildStatusChipSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildStatusChip_build
    }
  }
`;

interface Props {
  build: BuildStatusChip_build;
  className?: string;
  mini?: boolean;
}

function BuildStatusChip(props: Props) {
  let theme = useTheme();

  useEffect(() => {
    if (isBuildFinalStatus(props.build.status)) {
      return;
    }

    let variables = { buildID: props.build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [props.build.id, props.build.status]);

  let { build, mini, className } = props;
  let message = buildStatusMessage(build.status, build.durationInSeconds);
  let buildStatusColor = useBuildStatusColor(build.status);
  if (mini) {
    return (
      <Tooltip title={message}>
        <Avatar style={{ background: buildStatusColor }} className={className}>
          <Icon style={{ color: theme.palette.primary.contrastText }}>{buildStatusIconName(build.status)}</Icon>
        </Avatar>
      </Tooltip>
    );
  }
  return (
    <Tooltip
      title={
        build.clockDurationInSeconds
          ? `Clock duration: ${formatDuration(build.clockDurationInSeconds)}`
          : 'Clock duration not calculated yet!'
      }
    >
      <Chip
        className={className}
        label={message}
        avatar={
          <Avatar style={{ background: buildStatusColor }}>
            <Icon style={{ color: theme.palette.primary.contrastText }}>{buildStatusIconName(build.status)}</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(BuildStatusChip, {
  build: graphql`
    fragment BuildStatusChip_build on Build {
      id
      status
      durationInSeconds
      clockDurationInSeconds
    }
  `,
});
