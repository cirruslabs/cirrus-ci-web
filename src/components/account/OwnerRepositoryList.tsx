import React, { useMemo } from 'react';
import { useFragment } from 'react-relay';
import { Link } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import { useRecoilValue } from 'recoil';

import { muiThemeOptions } from 'cirrusTheme';
import mui from 'mui';

import RepositoryCard from 'components/repositories/RepositoryCard';
import useThemeWithAdjustableBreakpoints from 'utils/useThemeWithAdjustableBreakpoints';

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
    () => mui.createTheme(themeWithAdjustableBreakpoints),
    [themeWithAdjustableBreakpoints],
  );

  let organizationSettings: null | JSX.Element = null;

  if (info && info.viewerPermission === 'ADMIN') {
    organizationSettings = (
      <mui.Tooltip title="Account Settings">
        <Link to={`/settings/${info.platform}/${info.name}`}>
          <mui.IconButton size="large">
            <mui.icons.ManageAccounts />
          </mui.IconButton>
        </Link>
      </mui.Tooltip>
    );
  }

  return (
    <mui.ThemeProvider theme={themeForNewDesign}>
      <mui.Toolbar sx={{ justifyContent: 'start' }} disableGutters>
        <mui.Typography variant="h5" color="inherit" pr={0.5}>
          Repositories
        </mui.Typography>
        {organizationSettings}
      </mui.Toolbar>

      {/* CARDS */}
      <mui.Grid container spacing={2}>
        {info.repositories.edges.map(edge => {
          if (!edge.node.lastDefaultBranchBuild) return null;
          return (
            <mui.Grid xs={12} sm={6} md={4} key={edge.node.id}>
              <RepositoryCard repository={edge.node} />
            </mui.Grid>
          );
        })}
      </mui.Grid>
    </mui.ThemeProvider>
  );
}
