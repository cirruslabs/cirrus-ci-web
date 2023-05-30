import React, { useMemo } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useRecoilValue } from 'recoil';

import { createTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { muiThemeOptions } from '../../cirrusTheme';
import RepositoryCard from '../../components/repositories/RepositoryCard';

import { ViewerTopRepositoriesQuery } from './__generated__/ViewerTopRepositoriesQuery.graphql';

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
            ...RepositoryCard_repository
          }
        }
      }
    `,
    {},
  );

  let theme = useRecoilValue(muiThemeOptions);
  const themeForNewDesign = useMemo(() => createTheme(theme), [theme]);

  if (!response.viewer) {
    return (
      <div style={{ margin: '6px' }}>
        <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>
      </div>
    );
  }
  let repositories = response.viewer.topActiveRepositories;
  return (
    <ThemeProvider theme={themeForNewDesign}>
      <Stack spacing={1.5}>
        {repositories.map(repo => (
          <RepositoryCard key={repo.id} repository={repo} isDrawerView />
        ))}
      </Stack>
    </ThemeProvider>
  );
}
