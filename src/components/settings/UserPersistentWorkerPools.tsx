import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PersistentWorkerPoolsList from '../workers/PersistentWorkerPoolsList';
import { UserPersistentWorkerPools_user } from './__generated__/UserPersistentWorkerPools_user.graphql';

interface Props {
  user: UserPersistentWorkerPools_user;
}

class UserPersistentWorkerPools extends React.Component<Props> {
  render() {
    let user = this.props.user;
    return <PersistentWorkerPoolsList ownerId={user.githubUserId} pools={user.persistentWorkerPools || []} />;
  }
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
