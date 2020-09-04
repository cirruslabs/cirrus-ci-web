import React from 'react';
import { createPaginationContainer, RelayPaginationProp } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ComputeCreditsBase from './ComputeCreditsBase';
import { UserComputeCredits_user } from './__generated__/UserComputeCredits_user.graphql';
import ComputeCreditsTransactionsList from './ComputeCreditsTransactionsList';

interface Props {
  relay: RelayPaginationProp;
  user: UserComputeCredits_user;
  info?: any;
}

let UserComputeCredits = (props: Props) => {
  return (
    <ComputeCreditsBase
      accountId={props.user.githubUserId}
      balanceInCredits={props.user.balanceInCredits}
      transactionsComponent={
        <ComputeCreditsTransactionsList transactions={props.user.transactions.edges.map(edge => edge.node)} />
      }
    />
  );
};

export default createPaginationContainer(
  UserComputeCredits,
  {
    user: graphql`
      fragment UserComputeCredits_user on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 50 }, cursor: { type: "String" }) {
        githubUserId
        balanceInCredits
        transactions(last: $count, after: $cursor) @connection(key: "UserComputeCredits_transactions") {
          edges {
            node {
              taskId
              ...ComputeCreditsTransactionRow_transaction
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.transactions;
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
