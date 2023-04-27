import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { navigateHelper } from '../../utils/navigateHelper';

import { AccountSwitchQuery } from './__generated__/AccountSwitchQuery.graphql';

interface AccountSwitchProps {}

export default function AccountsSwitch(props: AccountSwitchProps) {
  const navigate = useNavigate();

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuItemClick = (e, name) => {
    setMenuAnchorEl(null);
    navigateHelper(navigate, e, '/github/' + name);
  };

  const viewer = useLazyLoadQuery<AccountSwitchQuery>(
    graphql`
      query AccountSwitchQuery {
        viewer {
          relatedOwners {
            platform
            name
          }
        }
      }
    `,
    {},
  ).viewer;
  if (!viewer) return null;
  if (viewer.relatedOwners && viewer.relatedOwners.length <= 1) return null;

  return (
    <>
      <Button variant="contained" onClick={handleMenuOpen} endIcon={<ArrowDropDownIcon />}>
        Accounts
      </Button>
      <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={handleMenuClose}>
        {viewer.relatedOwners.map(viewer => {
          return (
            <MenuItem key={viewer.name} onClick={e => handleMenuItemClick(e, viewer.name)}>
              {viewer.name}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
