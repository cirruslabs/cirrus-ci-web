import React from 'react';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PersistentWorkerPoolsList from '../workers/PersistentWorkerPoolsList';
import { OwnerPersistentWorkerPools_info$key } from './__generated__/OwnerPersistentWorkerPools_info.graphql';

interface Props {
  info: OwnerPersistentWorkerPools_info$key;
}

export default function OwnerPersistentWorkerPools(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerPersistentWorkerPools_info on OwnerInfo {
        uid
        persistentWorkerPools {
          id
          name
          enabledForPublic
        }
      }
    `,
    props.info,
  );

  return <PersistentWorkerPoolsList ownerUid={info.uid} pools={info.persistentWorkerPools || []} />;
}
