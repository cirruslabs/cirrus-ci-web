import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';
import {buildStatusColor} from "../../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../../utils/status";
import {graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";
import {Icon} from "material-ui";
import {cirrusColors} from "../../cirrusTheme";

const buildSubscription = graphql`
  subscription BuildStatusChipSubscription(
    $buildID: ID!
  ) {
    build(id: $buildID) {      
      id
      durationInSeconds
      status
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

export default BuildStatusChip
