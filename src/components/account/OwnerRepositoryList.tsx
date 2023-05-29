import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFragment } from 'react-relay';
import { useRecoilValue } from 'recoil';

import { graphql } from 'babel-plugin-relay/macro';

import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import RepositoryCard from '../repositories/RepositoryCard';
import { muiThemeOptions, cirrusOpenDrawerState } from '../../cirrusTheme';
import useThemeWithAdjustableBreakpoints from '../../utils/useThemeWithAdjustableBreakpoints';

import { OwnerRepositoryList_info$key } from './__generated__/OwnerRepositoryList_info.graphql';

interface Props {
  info: OwnerRepositoryList_info$key;
}

export default function OwnerRepositoryList(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerRepositoryList_info on OwnerInfo {
        platform
        uid
        name
        viewerPermission
        repositories(last: 50) {
          edges {
            node {
              id
              lastDefaultBranchBuild {
                id
              }
              ...RepositoryCard_repository
            }
          }
        }
      }
    `,
    props.info,
  );

  let theme = useRecoilValue(muiThemeOptions);
  let themeWithAdjustableBreakpoints = useThemeWithAdjustableBreakpoints(theme);
  const themeForNewDesign = useMemo(
    () => createTheme(themeWithAdjustableBreakpoints),
    [themeWithAdjustableBreakpoints],
  );

  const isDrawerOpen = useRecoilValue(cirrusOpenDrawerState);

  let organizationSettings = null;

  if (info && info.viewerPermission === 'ADMIN') {
    organizationSettings = (
      <Tooltip title="Account Settings">
        <Link to={`/settings/${info.platform}/${info.name}`}>
          <IconButton size="large">
            <ManageAccountsIcon />
          </IconButton>
        </Link>
      </Tooltip>
    );
  }

  return (
    <ThemeProvider theme={themeForNewDesign}>
      <Box px={isDrawerOpen && 2}>
        <Toolbar sx={{ justifyContent: 'start' }} disableGutters>
          <Typography variant="h5" color="inherit" pr={0.5}>
            Repositories
          </Typography>
          {organizationSettings}
        </Toolbar>

        {/* CARDS */}
        <List disablePadding sx={{ display: 'flex', flexWrap: 'wrap', mx: -0.5 }}>
          {info.repositories.edges.map(
            edge =>
              edge.node.lastDefaultBranchBuild && (
                <ListItem
                  key={edge.node.id}
                  disablePadding
                  sx={{ width: { xs: '100%', sm: '50%', md: '33.3333%' }, px: 0.5, mb: 1 }}
                >
                  <RepositoryCard repository={edge.node} />
                </ListItem>
              ),
          )}
        </List>
      </Box>
    </ThemeProvider>
  );
}
