import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import TimelineIcon from '@mui/icons-material/Timeline';

import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import RepositoryMetricsPage from 'components/metrics/RepositoryMetricsPage';
import NotFound from 'scenes/NotFound';

import { RepositoryMetricsQuery } from './__generated__/RepositoryMetricsQuery.graphql';

function RepositoryMetricsFor(platform: string, owner: string, name: string, parentProps) {
  const response = useLazyLoadQuery<RepositoryMetricsQuery>(
    graphql`
      query RepositoryMetricsQuery($platform: String!, $owner: String!, $name: String!) {
        ownerRepository(platform: $platform, owner: $owner, name: $name) {
          ...AppBreadcrumbs_repository
          ...RepositoryMetricsPage_repository
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { platform, owner, name },
  );

  if (!response.ownerRepository) {
    return <NotFound />;
  }

  return (
    <>
      <AppBreadcrumbs
        repository={response.ownerRepository}
        viewer={response.viewer}
        extraCrumbs={[
          {
            name: 'Metrics',
            Icon: TimelineIcon,
          },
        ]}
      />
      <RepositoryMetricsPage repository={response.ownerRepository} {...parentProps} />
    </>
  );
}

export default function RepositoryMetrics(parentProps) {
  const { platform, owner, name } = useParams();

  if (!platform || !owner || !name) {
    return <NotFound />;
  }

  return RepositoryMetricsFor(platform, owner, name, parentProps);
}
