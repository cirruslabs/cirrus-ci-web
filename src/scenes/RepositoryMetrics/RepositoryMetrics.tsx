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
  const { owner, name } = useParams();
  return (
    <QueryRenderer<RepositoryMetricsQuery>
      environment={environment}
      variables={{ owner, name }}
      query={graphql`
        query RepositoryMetricsQuery($owner: String!, $name: String!) {
          githubRepository(owner: $owner, name: $name) {
            ...RepositoryMetricsPage_repository
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.githubRepository) {
          return <NotFound message={error} />;
        }
        return <RepositoryMetricsPage repository={props.githubRepository} {...parentProps} />;
      }}
    />
  );
}
