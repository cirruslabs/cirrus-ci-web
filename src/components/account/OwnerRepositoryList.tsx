import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFragment } from 'react-relay';
import { useRecoilValue } from 'recoil';

import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import RepositoryCard from '../repositories/RepositoryCard';
import { muiThemeOptions } from '../../cirrusTheme';
import useThemeWithAdjustableBreakpoints from '../../utils/useThemeWithAdjustableBreakpoints';

import { OwnerRepositoryList_info$key } from './__generated__/OwnerRepositoryList_info.graphql';

const useStyles = makeStyles(theme => {
  return {
    toolbar: {
      paddingLeft: 14,
    },
  };
});

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

  let classes = useStyles();

  let theme = useRecoilValue(muiThemeOptions);
  let themeWithAdjustableBreakpoints = useThemeWithAdjustableBreakpoints(theme);
  const themeForNewDesign = useMemo(
    () => createTheme(themeWithAdjustableBreakpoints),
    [themeWithAdjustableBreakpoints],
  );

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
      <Toolbar className={classes.toolbar} sx={{ justifyContent: 'space-between' }} disableGutters>
        <Typography variant="h5" color="inherit">
          Repositories
        </Typography>
        {organizationSettings}
      </Toolbar>

      {/* CARDS */}
      <List disablePadding sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
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
    </ThemeProvider>
  );
}
