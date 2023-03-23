import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useParams } from 'react-router-dom';

import NotFound from '../NotFound';
import PoolDetails from '../../components/workers/PoolDetails';

import { PoolByIdQuery } from './__generated__/PoolByIdQuery.graphql';
import { useEffect, useState } from 'react';

export default function PoolById(): JSX.Element {
  let { poolId } = useParams();

  if (!poolId) {
    return <NotFound />;
  }

  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState(null);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setRefreshedQueryOptions(prev => ({
        fetchKey: (prev?.fetchKey ?? 0) + 1,
        fetchPolicy: 'store-and-network',
      }));
    }, 10_000);
    return () => clearInterval(timeoutId);
  });

  const response = useLazyLoadQuery<PoolByIdQuery>(
    graphql`
      query PoolByIdQuery($poolId: ID!) {
        persistentWorkerPool(poolId: $poolId) {
          ...PoolDetails_pool
        }
      }
    `,
    { poolId },
    refreshedQueryOptions ?? {},
  );

  // todo: pass error message to <NotFound>
  if (!response.persistentWorkerPool) {
    return <NotFound />;
  }
  return <PoolDetails pool={response.persistentWorkerPool} />;
}
