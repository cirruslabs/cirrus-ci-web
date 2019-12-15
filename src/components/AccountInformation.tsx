import React, { SyntheticEvent } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { navigate } from '../utils/navigate';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import { AccountInformation_viewer } from './__generated__/AccountInformation_viewer.graphql';

interface Props extends RouteComponentProps {
  viewer: AccountInformation_viewer;
}

type State = {
  anchorEl: SyntheticEvent['currentTarget'] | null;
};

class AccountInformation extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props: Props) {
    super(props);
    this.state = { anchorEl: null };
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  handleMenuOpen(event: SyntheticEvent) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
        >
          <Avatar style={{ cursor: 'pointer' }} src={this.props.viewer.avatarURL} />
        </IconButton>
        <Menu id="long-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleMenuClose}>
          <MenuItem onClick={event => navigate(this.context.router, event, '/settings/profile/')}>
            <ListItemIcon>
              <Icon>person</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Profile" />
          </MenuItem>
          <MenuItem onClick={event => navigate(null, event, 'https://api.cirrus-ci.com/redirect/logout/')}>
            <ListItemIcon>
              <Icon>directions_run</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Log Out" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(AccountInformation), {
  viewer: graphql`
    fragment AccountInformation_viewer on User {
      id
      githubUserName
      avatarURL
    }
  `,
});
