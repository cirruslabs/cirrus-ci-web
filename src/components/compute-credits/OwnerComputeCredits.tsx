import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createPaginationContainer, RelayPaginationProp } from 'react-relay';
import ComputeCreditsBase from './ComputeCreditsBase';
import { OwnerComputeCredits_info } from './__generated__/OwnerComputeCredits_info.graphql';
import ComputeCreditsTransactionsList from './ComputeCreditsTransactionsList';

interface Props {
  relay: RelayPaginationProp;
  info: OwnerComputeCredits_info;
}

let OwnerComputeCredits = (props: Props) => {
  return (
    <ComputeCreditsBase
      ownerUid={props.info.uid}
      balanceInCredits={props.info.balanceInCredits}
      info={props.info}
      transactionsComponent={
        <ComputeCreditsTransactionsList transactions={props.info.transactions.edges.map(edge => edge.node)} />
      }
    />
  );
};

export default createPaginationContainer(
  OwnerComputeCredits,
  {
    info: graphql`
      fragment OwnerComputeCredits_info on OwnerInfo
      @argumentDefinitions(count: { type: "Int", defaultValue: 50 }, cursor: { type: "String" }) {
        uid
        name
        balanceInCredits
        ...ComputeCreditsBase_info
        transactions(last: $count, after: $cursor) @connection(key: "OwnerComputeCredits_transactions") {
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
      return props.info && props.info.transactions;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props: any, { count, cursor }, fragmentVariables) {
      return {
        count: count,
        cursor: cursor,
        platform: props.info.platform,
        uid: props.info.uid,
      };
    },
    query: graphql`
      query OwnerComputeCreditsQuery($platform: String!, $uid: ID!, $count: Int!, $cursor: String) {
        ownerInfo(platform: $platform, uid: $uid) {
          ...OwnerComputeCredits_info @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
