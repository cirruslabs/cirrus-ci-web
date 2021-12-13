import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import MetricsChart from './MetricsChart';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import { RepositoryMetricsChartsQuery } from './__generated__/RepositoryMetricsChartsQuery.graphql';

const RepositoryMetricsCharts = props => (
  <QueryRenderer<RepositoryMetricsChartsQuery>
    environment={environment}
    variables={{
      repositoryId: props.repositoryId,
      parameters: props.parameters,
    }}
    query={graphql`
      query RepositoryMetricsChartsQuery($repositoryId: ID!, $parameters: MetricsQueryParameters!) {
        repository(id: $repositoryId) {
          metrics(parameters: $parameters) {
            ...MetricsChart_chart
          }
        }
      }
    `}
    render={({ error, props }) => {
      if (error) {
        console.log(error);
      }
      if (!props) {
        return <CirrusLinearProgress />;
      }
      let metrics = props.repository.metrics || [];
      let chartComponents = metrics.map((chart, index) => <MetricsChart key={index} chart={chart} />);
      return <div>{chartComponents}</div>;
    }}
  />
);

export default RepositoryMetricsCharts;
