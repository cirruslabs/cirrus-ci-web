import React, { useEffect, useState } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useParams } from 'react-router-dom';

import NotFound from '../NotFound';
import PoolDetails from '../../components/workers/PoolDetails';

import { PoolByIdQuery } from './__generated__/PoolByIdQuery.graphql';

function PoolDetailsById(poolId: string) {
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setFetchKey(fetchKey + 1);
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
    {
      fetchKey: fetchKey,
      fetchPolicy: 'store-and-network',
    },
  );

  // todo: pass error message to <NotFound>
  if (!response.persistentWorkerPool) {
    return <NotFound />;
  }
  return <PoolDetails pool={response.persistentWorkerPool} />;
}

export default function PoolById() {
  let { poolId } = useParams();

  if (!poolId) {
    return <NotFound />;
  }

  return PoolDetailsById(poolId);
}
