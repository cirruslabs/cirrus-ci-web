import React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { navigateHelper } from '../../utils/navigateHelper';
import { useNavigate } from 'react-router-dom';
import { AccountInformation_viewer$key } from './__generated__/AccountInformation_viewer.graphql';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => {
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
      <Button
        className={classes.authButton}
        startIcon={<GitHubIcon />}
        href="https://api.cirrus-ci.com/redirect/auth/github"
      >
        Sign in
      </Button>
    );
  }
  return (
    <div>
      <IconButton
        aria-label="menu"
        aria-owns={anchorEl ? 'long-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
      >
        <Avatar style={{ cursor: 'pointer' }} src={viewer.avatarURL} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={event => {
            handleClose();
            navigateHelper(navigate, event, '/settings/profile/');
          }}
        >
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Settings" />
        </MenuItem>
        <MenuItem
          onClick={event => {
            handleClose();
            navigateHelper(navigate, event, 'https://api.cirrus-ci.com/redirect/logout/');
          }}
        >
          <ListItemIcon>
            <DirectionsRun />
          </ListItemIcon>
          <ListItemText inset primary="Log Out" />
        </MenuItem>
      </Menu>
    </div>
  );
}
