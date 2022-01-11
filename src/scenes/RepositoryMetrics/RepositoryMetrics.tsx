import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import RepositoryMetricsPage from '../../components/metrics/RepositoryMetricsPage';
import { RepositoryMetricsQuery } from './__generated__/RepositoryMetricsQuery.graphql';
import { useParams } from 'react-router-dom';

export default function RepositoryMetrics(parentProps): JSX.Element {
  const { platform, owner, name } = useParams();
  return (
    <QueryRenderer<RepositoryMetricsQuery>
      environment={environment}
      variables={{ platform, owner, name }}
      query={graphql`
        query RepositoryMetricsQuery($platform: String!, $owner: String!, $name: String!) {
          ownerRepository(platform: $platform, owner: $owner, name: $name) {
            ...RepositoryMetricsPage_repository
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.ownerRepository) {
          return <NotFound message={error} />;
        }
        return <RepositoryMetricsPage repository={props.ownerRepository} {...parentProps} />;
      }}
    />
  );
}
