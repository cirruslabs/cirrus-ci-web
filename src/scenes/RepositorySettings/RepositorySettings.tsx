import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import RepositorySettingsPage from '../../components/repositories/RepositorySettingsPage';
import NotFound from '../NotFound';
import { RepositorySettingsQuery } from './__generated__/RepositorySettingsQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

function RepositorySettingsById(repositoryId: string): JSX.Element {
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
export default function RepositorySettings(): JSX.Element {
  let { repositoryId } = useParams();

  if (!repositoryId) {
    return <NotFound />;
  }

  return RepositorySettingsById(repositoryId);
}
