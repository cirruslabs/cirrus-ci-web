import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import Avatar from 'material-ui/Avatar';
import {IconMenu, MenuItem} from "material-ui";

class AccountInformation extends React.Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={<Avatar style={{cursor: "pointer"}} src={this.props.viewer.avatarURL}/>}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
      >
        <MenuItem primaryText="Log Out" href="http://api.cirrus-ci.org/redirect/logout/"/>
      </IconMenu>
    );
  }
}

export default createFragmentContainer(AccountInformation, {
  viewer: graphql`
    fragment AccountInformation_viewer on User {
      id
      githubUserName
      avatarURL
    }
  `,
});
