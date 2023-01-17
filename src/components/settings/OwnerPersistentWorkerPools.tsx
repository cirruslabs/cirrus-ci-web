import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PersistentWorkerPoolsList from '../workers/PersistentWorkerPoolsList';
import { OwnerPersistentWorkerPools_info } from './__generated__/OwnerPersistentWorkerPools_info.graphql';

interface Props {
  info: OwnerPersistentWorkerPools_info;
}

function OwnerPersistentWorkerPools(props: Props) {
  let info = props.info;
  return <PersistentWorkerPoolsList ownerUid={info.uid} pools={!info.persistentWorkerPools || []} />;
}

export default createFragmentContainer(OwnerPersistentWorkerPools, {
  info: graphql`
    fragment OwnerPersistentWorkerPools_info on OwnerInfo {
      uid
      persistentWorkerPools {
        id
        name
        enabledForPublic
      }
    }
  `,
});
