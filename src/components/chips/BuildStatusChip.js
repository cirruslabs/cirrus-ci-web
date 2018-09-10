import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import {buildStatusColor} from "../../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../../utils/status";
import {createFragmentContainer, graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";
import {cirrusColors} from "../../cirrusTheme";

const buildSubscription = graphql`
  subscription BuildStatusChipSubscription(
    $buildID: ID!
  ) {
    build(id: $buildID) {      
      ...BuildStatusChip_build
    }
  }
`;

class BuildStatusChip extends React.Component {
  componentDidMount() {
    let variables = {buildID: this.props.build.id};

    this.subscription = requestSubscription(
      environment,
      {
        subscription: buildSubscription,
        variables: variables
      }
    );
  }

  componentWillUnmount() {
    this.closeSubscription();
  }

  closeSubscription() {
    this.subscription && this.subscription.dispose && this.subscription.dispose()
  }

  render() {
    let {build, mini} = this.props;
    let message = buildStatusMessage(build);
    if (mini) {
      return (
        <Tooltip title={message}>
          <Avatar style={{background: buildStatusColor(build.status)}} className={this.props.className}>
            <Icon style={{color: cirrusColors.cirrusWhite}}>{buildStatusIconName(build.status)}</Icon>
          </Avatar>
        </Tooltip>
      );
    }
    return (
      <Chip className={this.props.className}
            label={message}
            avatar={
              <Avatar style={{background: buildStatusColor(build.status)}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>{buildStatusIconName(build.status)}</Icon>
              </Avatar>
            }/>
    );
  }
}

export default createFragmentContainer(BuildStatusChip, {
  build: graphql`
    fragment BuildStatusChip_build on Build {
      id
      status
      durationInSeconds
    }
  `,
});
