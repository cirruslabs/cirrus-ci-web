import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import PoolDetails from '../../components/workers/PoolDetails';
import { PoolByIdQuery } from './__generated__/PoolByIdQuery.graphql';
import { useParams } from 'react-router-dom';

export default function PoolById(): JSX.Element {
  let { poolId } = useParams();
  return (
    <QueryRenderer<PoolByIdQuery>
      environment={environment}
      variables={{ poolId }}
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
}
