import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useParams } from 'react-router-dom';

import NotFound from '../NotFound';
import PoolDetails from '../../components/workers/PoolDetails';

import { PoolByIdQuery } from './__generated__/PoolByIdQuery.graphql';

export default function PoolById(): JSX.Element {
  let { poolId } = useParams();

  const response = useLazyLoadQuery<PoolByIdQuery>(
    graphql`
      query PoolByIdQuery($poolId: ID!) {
        persistentWorkerPool(poolId: $poolId) {
          ...PoolDetails_pool
        }
      }
    `,
    { poolId },
  );

  // todo: pass error message to <NotFound>
  if (!response.persistentWorkerPool) {
    return <NotFound />;
  }
  return <PoolDetails pool={response.persistentWorkerPool} />;
}
