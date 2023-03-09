import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useEffect, useMemo } from 'react';
import { useFragment, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { useBuildStatusColor } from '../../utils/colors';
import { buildStatusIconName, buildStatusMessage, isBuildFinalStatus } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { BuildStatusChip_build$key } from './__generated__/BuildStatusChip_build.graphql';
import { useTheme } from '@mui/material';

const buildSubscription = graphql`
  subscription BuildStatusChipSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildStatusChip_build
    }
  }
`;

interface Props {
  build: BuildStatusChip_build$key;
  className?: string;
  mini?: boolean;
}

export default function BuildStatusChip(props: Props) {
  let build = useFragment(
    graphql`
      fragment BuildStatusChip_build on Build {
        id
        status
        durationInSeconds
        clockDurationInSeconds
      }
    `,
    props.build,
  );

  let theme = useTheme();

  const isFinalStatus = useMemo(() => isBuildFinalStatus(build.status), [build.status]);
  useEffect(() => {
    if (isFinalStatus) {
      return;
    }

    let variables = { buildID: build.id };

    const subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
    return () => {
      subscription.dispose();
    };
  }, [build.id, isFinalStatus]);

  let { mini, className } = props;
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
