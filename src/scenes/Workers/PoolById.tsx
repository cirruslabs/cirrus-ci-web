import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { RouteComponentProps } from 'react-router';
import PoolDetails from '../../components/workers/PoolDetails';
import { PoolByIdQuery } from './__generated__/PoolByIdQuery.graphql';

interface MatchParams {
  poolId: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export default (props: Props) => (
  <QueryRenderer<PoolByIdQuery>
    environment={environment}
    variables={props.match.params}
    query={graphql`
      query PoolByIdQuery($poolId: ID!) {
        persistentWorkerPool(poolId: $poolId) {
          ...PoolDetails_pool
        }
      }
    `}
    render={({ error, props }) => {
      if (!props) {
        return <CirrusLinearProgress />;
      }
      if (!props.persistentWorkerPool) {
        return <NotFound message={error} />;
      }
      return <PoolDetails pool={props.persistentWorkerPool} />;
    }}
  />
);
