import React from 'react';
import { createPaginationContainer, RelayPaginationProp } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ComputeCreditsBase from './ComputeCreditsBase';
import { UserComputeCredits_user } from './__generated__/UserComputeCredits_user.graphql';
import UserComputeCreditsTransactionsList from './UserComputeCreditsTransactionsList';

interface Props {
  relay: RelayPaginationProp;
  user: UserComputeCredits_user;
  info?: any;
}

class UserComputeCredits extends React.Component<Props> {
  render() {
    return (
      <ComputeCreditsBase
        accountId={this.props.user.githubUserId}
        balanceInCredits={this.props.user.balanceInCredits}
        transactionsComponent={<UserComputeCreditsTransactionsList user={this.props.user} />}
      />
    );
  }
}

export default createPaginationContainer(
  UserComputeCredits,
  {
    user: graphql`
      fragment UserComputeCredits_user on User
        @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
        githubUserId
        balanceInCredits
        ...UserComputeCreditsTransactionsList_user @arguments(count: $count, cursor: $cursor)
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      console.log('props', props);
      return props.user && props.user['transactions'];
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count: count,
        cursor: cursor,
      };
    },
    query: graphql`
      query UserComputeCreditsQuery($count: Int!, $cursor: String) {
        viewer {
          ...UserComputeCredits_user @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
