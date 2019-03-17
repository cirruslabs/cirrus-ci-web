import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import {taskStatusColor} from "../../utils/colors";
import {taskStatusIconName} from "../../utils/status";
import {roundAndPresentDuration} from "../../utils/time";
import {cirrusColors} from "../../cirrusTheme";
import {createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';

class BuildCreatedChip extends React.Component {
  render() {
    let creationTimestamp = this.props.build.buildCreatedTimestamp;
    let durationAgoInSeconds = (Date.now() - creationTimestamp) / 1000;
    if (durationAgoInSeconds < 60) {
      // force update in a second
      setTimeout(() => this.forceUpdate(), 1000);
    } else {
      // force update in a minute
      setTimeout(() => this.forceUpdate(), 60 * 1000);
    }
    let durationInSeconds = Math.floor(durationAgoInSeconds);
    return (
      <Tooltip
        title={`Created at ${new Date(creationTimestamp).toLocaleTimeString()} on ${new Date(creationTimestamp).toDateString()}`}>
        <Chip className={this.props.className}
              label={`Created ${roundAndPresentDuration(durationInSeconds)} ago`}
              avatar={
                <Avatar style={{backgroundColor: taskStatusColor('CREATED')}}>
                  <Icon style={{color: cirrusColors.cirrusWhite}}>{taskStatusIconName('CREATED')}</Icon>
                </Avatar>
              }/>
      </Tooltip>
    );
  }
}

export default createFragmentContainer(BuildCreatedChip, {
  build: graphql`
    fragment BuildCreatedChip_build on Build {
      id
      buildCreatedTimestamp
    }
  `,
});
