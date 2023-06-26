import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { navigateHelper } from 'utils/navigateHelper';

import { AccountInformation_viewer$key } from './__generated__/AccountInformation_viewer.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    authButton: {
      color: theme.palette.primary.contrastText,
      marginLeft: 10,
    },
  };
});

interface Props {
  viewer: AccountInformation_viewer$key | null;
}

export default function AccountInformation(props: Props) {
  let viewer = useFragment(
    graphql`
      fragment AccountInformation_viewer on User {
        avatarURL
      }
    `,
    props.viewer,
  );
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let classes = useStyles();

  if (!viewer) {
    return (
      <mui.Button
        className={classes.authButton}
        startIcon={<mui.icons.GitHub />}
        href="https://api.cirrus-ci.com/redirect/auth/github"
      >
        Sign in
      </mui.Button>
    );
  }
  return (
    <div>
      <mui.IconButton
        aria-label="menu"
        aria-owns={anchorEl ? 'long-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
      >
        <mui.Avatar style={{ cursor: 'pointer' }} src={viewer.avatarURL} />
      </mui.IconButton>
      <mui.Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <mui.MenuItem
          onClick={event => {
            handleClose();
            navigateHelper(navigate, event, '/settings/profile/');
          }}
        >
          <mui.ListItemIcon>
            <mui.icons.ManageAccounts />
          </mui.ListItemIcon>
          <mui.ListItemText inset primary="Settings" />
        </mui.MenuItem>
        <mui.MenuItem
          onClick={event => {
            handleClose();
            navigateHelper(navigate, event, 'https://api.cirrus-ci.com/redirect/logout/');
          }}
        >
          <mui.ListItemIcon>
            <mui.icons.DirectionsRun />
          </mui.ListItemIcon>
          <mui.ListItemText inset primary="Log Out" />
        </mui.MenuItem>
      </mui.Menu>
    </div>
  );
}
