import React from 'react';

import { graphql } from 'babel-plugin-relay/macro';
import { useLazyLoadQuery } from 'react-relay';

import NotFound from '../NotFound';
import RepositoryMetricsPage from '../../components/metrics/RepositoryMetricsPage';
import { RepositoryMetricsQuery } from './__generated__/RepositoryMetricsQuery.graphql';
import { useParams } from 'react-router-dom';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function RepositoryMetrics(parentProps): JSX.Element {
  const { platform, owner, name } = useParams();

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
