import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AccessTime from '@material-ui/icons/AccessTime';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { cirrusColors } from '../../cirrusTheme';
import { NextCronInvocationTimeChip_settings } from './__generated__/NextCronInvocationTimeChip_settings.graphql';

interface Props {
  settings: NextCronInvocationTimeChip_settings;
  className?: string;
}

class NextCronInvocationTimeChip extends React.Component<Props> {
  render() {
    let nextInvocationTimestamp = this.props.settings.nextInvocationTimestamp;
    return (
      <Tooltip
        title={`Next invocation will be at ${new Date(nextInvocationTimestamp).toLocaleTimeString()} on ${new Date(
          nextInvocationTimestamp,
        ).toDateString()}`}
      >
        <Chip
          className={this.props.className}
          label={`Next invocation: ${new Date(nextInvocationTimestamp).toLocaleTimeString()}`}
          avatar={
            <Avatar style={{ background: cirrusColors.cirrusPrimary }}>
              <AccessTime style={{ color: cirrusColors.cirrusWhite }} />
            </Avatar>
          }
        />
      </Tooltip>
    );
  }
}

export default createFragmentContainer(NextCronInvocationTimeChip, {
  settings: graphql`
    fragment NextCronInvocationTimeChip_settings on RepositoryCronSettings {
      nextInvocationTimestamp
    }
  `,
});
