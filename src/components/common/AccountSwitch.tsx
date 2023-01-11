import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { WithStyles } from '@mui/styles';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { navigateHelper } from '../../utils/navigateHelper';

import { AppBreadcrumbs_viewer } from './__generated__/AppBreadcrumbs_viewer.graphql';

const styles = theme => createStyles({});
const styled = withStyles(styles);

interface AccountSwitchProps extends WithStyles<typeof styles> {
  viewer: AppBreadcrumbs_viewer;
}

const AccountsSwitch = styled(({ viewer, classes }: AccountSwitchProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (e, name) => {
    setAnchorEl(null);
    navigateHelper(navigate, e, '/github/' + name);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        Accounts
        <ArrowDropDownIcon />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {viewer.relatedOwners.map(viewer => {
          return <MenuItem onClick={e => handleMenuItemClick(e, viewer.name)}>{viewer.name}</MenuItem>;
        })}
      </Menu>
    </>
  );
});

export default createFragmentContainer(styled(AccountsSwitch), {
  viewer: graphql`
    fragment AccountSwitch_viewer on User {
      relatedOwners {
        platform
        name
      }
    }
  `,
});
