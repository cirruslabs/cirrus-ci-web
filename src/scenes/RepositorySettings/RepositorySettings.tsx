import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import RepositorySettingsPage from 'components/repositories/RepositorySettingsPage';
import NotFound from 'scenes/NotFound';

import { RepositorySettingsQuery } from './__generated__/RepositorySettingsQuery.graphql';

function RepositorySettingsById(repositoryId: string) {
  const response = useLazyLoadQuery<RepositorySettingsQuery>(
    graphql`
      query RepositorySettingsQuery($repositoryId: ID!) {
        repository(id: $repositoryId) {
          ...AppBreadcrumbs_repository
          ...RepositorySettingsPage_repository
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { repositoryId },
  );

  if (!response.repository) {
    return <NotFound />;
  }

  return (
    <>
      <AppBreadcrumbs
        repository={response.repository}
        viewer={response.viewer}
        extraCrumbs={[
          {
            name: 'Repository Settings',
            Icon: SettingsOutlinedIcon,
          },
        ]}
      />
      <RepositorySettingsPage repository={response.repository} />
    </>
  );
}

export default function RepositorySettings() {
  let { repositoryId } = useParams();

  if (!repositoryId) {
    return <NotFound />;
  }

  return RepositorySettingsById(repositoryId);
}
