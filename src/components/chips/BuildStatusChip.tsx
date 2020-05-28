import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer, Disposable, requestSubscription } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { buildStatusColor } from '../../utils/colors';
import { buildStatusIconName, buildStatusMessage, isBuildFinalStatus } from '../../utils/status';
import { formatDuration } from '../../utils/time';
import { BuildStatusChip_build } from './__generated__/BuildStatusChip_build.graphql';
import { WithTheme, withTheme } from '@material-ui/core';

const buildSubscription = graphql`
  subscription BuildStatusChipSubscription($buildID: ID!) {
    build(id: $buildID) {
      ...BuildStatusChip_build
    }
  }
`;

interface Props extends WithTheme {
  build: BuildStatusChip_build;
  className?: string;
  mini?: boolean;
}

class BuildStatusChip extends React.Component<Props> {
  subscription: Disposable;

  componentDidMount() {
    if (isBuildFinalStatus(this.props.build.status)) {
      return;
    }

    let variables = { buildID: this.props.build.id };

    this.subscription = requestSubscription(environment, {
      subscription: buildSubscription,
      variables: variables,
    });
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose();
  }

  render() {
    let { build, mini, className } = this.props;
    let message = buildStatusMessage(build.status, build.durationInSeconds);
    if (mini) {
      return (
        <Tooltip title={message}>
          <Avatar style={{ background: buildStatusColor(build.status) }} className={className}>
            <Icon style={{ color: this.props.theme.palette.background.paper }}>
              {buildStatusIconName(build.status)}
            </Icon>
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
            <Avatar style={{ background: buildStatusColor(build.status) }}>
              <Icon style={{ color: this.props.theme.palette.background.paper }}>
                {buildStatusIconName(build.status)}
              </Icon>
            </Avatar>
          }
        />
      </Tooltip>
    );
  }
}

export default createFragmentContainer(withTheme(BuildStatusChip), {
  build: graphql`
    fragment BuildStatusChip_build on Build {
      id
      status
      durationInSeconds
      clockDurationInSeconds
    }
  `,
});
