import React from 'react';

import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import NotFound from '../NotFound';
import RepositoryMetricsPage from '../../components/metrics/RepositoryMetricsPage';

const RepositoryMetrics = props => (
  <QueryRenderer
    environment={environment}
    variables={props.match.params}
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
      return <RepositoryMetricsPage repository={props.githubRepository} />;
    }}
  />
);

export default RepositoryMetrics;
