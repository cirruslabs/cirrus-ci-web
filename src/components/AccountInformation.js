import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import Avatar from 'material-ui/Avatar';

class AccountInformation extends React.Component {
  render() {
    return <Avatar src={this.props.viewer.avatarURL}/>;
  }
}

export default createFragmentContainer(AccountInformation, {
  viewer: graphql`
    fragment AccountInformation_viewer on User {
      id
      name
      avatarURL
    }
  `,
});
