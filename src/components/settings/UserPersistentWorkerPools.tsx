import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PersistentWorkerPoolsList from '../workers/PersistentWorkerPoolsList';
import { UserPersistentWorkerPools_user } from './__generated__/UserPersistentWorkerPools_user.graphql';

interface Props {
  user: UserPersistentWorkerPools_user;
}

function UserPersistentWorkerPools(props: Props) {
  let user = props.user;
  return (
    <PersistentWorkerPoolsList ownerUid={user.githubUserId.toString(10)} pools={user.persistentWorkerPools || []} />
  );
}

export default createFragmentContainer(UserPersistentWorkerPools, {
  user: graphql`
    fragment UserPersistentWorkerPools_user on User {
      githubUserId
      persistentWorkerPools {
        id
        name
        enabledForPublic
      }
    }
  `,
});
