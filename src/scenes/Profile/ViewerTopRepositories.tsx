import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { ViewerTopRepositoriesQuery } from './__generated__/ViewerTopRepositoriesQuery.graphql';
import ActiveRepositoryCard from '../../components/builds/ActiveRepositoryCard';

interface Props {
  className?: string;
}

export default function ViewerTopRepositories(props: Props) {
  const response = useLazyLoadQuery<ViewerTopRepositoriesQuery>(
    graphql`
      query ViewerTopRepositoriesQuery {
        viewer {
          topActiveRepositories {
            id
            ...ActiveRepositoryCard_repository
          }
        }
      }
    `,
    {},
  );

  if (!response.viewer) {
    return (
      <div style={{ margin: '6px' }}>
        <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>
      </div>
    );
  }
  let repositories = response.viewer.topActiveRepositories;
  return (
    <List disablePadding>
      {repositories.map(repo => (
        <ListItem key={repo.id} disablePadding sx={{ mb: 0.5 }}>
          <ActiveRepositoryCard repository={repo} />
        </ListItem>
      ))}
    </List>
  );
}
