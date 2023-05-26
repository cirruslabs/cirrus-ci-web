import React from 'react';
import { Link } from 'react-router-dom';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import RepositoryCard from '../repositories/RepositoryCard';

import { OwnerRepositoryList_info$key } from './__generated__/OwnerRepositoryList_info.graphql';

const useStyles = makeStyles(theme => {
  return {
    toolbar: {
      paddingLeft: 14,
    },
    cards: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    card: {
      width: '33.33333332%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
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
              ...LastDefaultBranchBuildRow_repository
            }
          }
        }
      }
    `,
    props.info,
  );

  let classes = useStyles();

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
    <>
      <Toolbar className={classes.toolbar} sx={{ justifyContent: 'space-between' }} disableGutters>
        <Typography variant="h5" color="inherit">
          Repositories
        </Typography>
        {organizationSettings}
      </Toolbar>

      {/* CARDS */}
      <List className={classes.cards} disablePadding sx={{ mx: -1 }}>
        {info.repositories.edges.map(edge => (
          <ListItem className={classes.card} key={edge.node.id} disablePadding sx={{ px: 1, mb: 1 }}>
            <RepositoryCard />
          </ListItem>
        ))}
      </List>
    </>
  );
}
