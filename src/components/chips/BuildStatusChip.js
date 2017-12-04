import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {buildStatusColor} from "../../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../../utils/status";
import {graphql, requestSubscription} from "react-relay";
import environment from "../../createRelayEnvironment";

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
      <Chip style={this.props.style}>
        <Avatar backgroundColor={buildStatusColor(build.status)}
                icon={<FontIcon className="material-icons">{buildStatusIconName(build.status)}</FontIcon>}/>
        {buildStatusMessage(build)}
      </Chip>
    );
  }
}

export default BuildStatusChip
