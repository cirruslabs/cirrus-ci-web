import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
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
    let build = this.props.build;
    return (
      <Chip className={this.props.className}
            label={buildStatusMessage(build)}
            avatar={
              <Avatar style={{background: buildStatusColor(build.status)}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>{buildStatusIconName(build.status)}</Icon>
              </Avatar>
            }/>
    );
  }
}

export default BuildStatusChip
