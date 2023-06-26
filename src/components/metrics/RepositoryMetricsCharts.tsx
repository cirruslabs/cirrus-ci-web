import React from 'react';
import { useLazyLoadQuery } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import MetricsChart from './MetricsChart';
import {
  RepositoryMetricsChartsQuery,
  RepositoryMetricsChartsQuery$variables,
} from './__generated__/RepositoryMetricsChartsQuery.graphql';

export default function RepositoryMetricsCharts(props: RepositoryMetricsChartsQuery$variables) {
  const response = useLazyLoadQuery<RepositoryMetricsChartsQuery>(
    graphql`
      query RepositoryMetricsChartsQuery($repositoryId: ID!, $parameters: MetricsQueryParameters!) {
        repository(id: $repositoryId) {
          metrics(parameters: $parameters) {
            ...MetricsChart_chart
          }
        }
      }
    `,
    props,
  );
  let metrics = response.repository?.metrics || [];
  let chartComponents = metrics.map((chart, index) => <MetricsChart key={index} chart={chart} />);
  return <div>{chartComponents}</div>;
}
