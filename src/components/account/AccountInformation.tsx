import React, { SyntheticEvent } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { navigate } from '../../utils/navigate';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountInformation_viewer } from './__generated__/AccountInformation_viewer.graphql';
import Settings from '@material-ui/icons/Settings';
import DirectionsRun from '@material-ui/icons/DirectionsRun';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = theme =>
  createStyles({
    authButton: {
      color: theme.palette.primary.contrastText,
    },
  });

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  viewer: AccountInformation_viewer;
}

let AccountInformation = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState((null as unknown) as SyntheticEvent['currentTarget']);

  let { viewer, classes } = props;

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
        onClick={(event: SyntheticEvent) => setAnchorEl(event.currentTarget)}
      >
        <Avatar style={{ cursor: 'pointer' }} src={viewer.avatarURL} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={event => navigate(null, event, '/settings/profile/')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText inset primary="Settings" />
        </MenuItem>
        <MenuItem onClick={event => navigate(null, event, 'https://api.cirrus-ci.com/redirect/logout/')}>
          <ListItemIcon>
            <DirectionsRun />
          </ListItemIcon>
          <ListItemText inset primary="Log Out" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default createFragmentContainer(withRouter(withStyles(styles)(AccountInformation)), {
  viewer: graphql`
    fragment AccountInformation_viewer on User {
      avatarURL
    }
  `,
});
