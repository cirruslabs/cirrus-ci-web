import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { createPaginationContainer, RelayPaginationProp } from 'react-relay';
import ComputeCreditsBase from './ComputeCreditsBase';
import { OrganizationComputeCredits_info } from './__generated__/OrganizationComputeCredits_info.graphql';
import ComputeCreditsTransactionsList from './ComputeCreditsTransactionsList';

interface Props {
  relay: RelayPaginationProp;
  info: OrganizationComputeCredits_info;
}

let OrganizationComputeCredits = (props: Props) => {
  return (
    <ComputeCreditsBase
      accountId={parseInt(props.info.id, 10)}
      balanceInCredits={props.info.balanceInCredits}
      info={props.info}
      transactionsComponent={
        <ComputeCreditsTransactionsList transactions={props.info.transactions.edges.map(edge => edge.node)} />
      }
    />
  );
};

export default createPaginationContainer(
  OrganizationComputeCredits,
  {
    info: graphql`
      fragment OrganizationComputeCredits_info on GitHubOrganizationInfo
        @argumentDefinitions(count: { type: "Int", defaultValue: 50 }, cursor: { type: "String" }) {
        id
        name
        balanceInCredits
        ...ComputeCreditsBase_info
        transactions(last: $count, after: $cursor) @connection(key: "OrganizationComputeCredits_transactions") {
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
        organization: props.info.name,
      };
    },
    query: graphql`
      query OrganizationComputeCreditsQuery($count: Int!, $cursor: String, $organization: String!) {
        githubOrganizationInfo(organization: $organization) {
          ...OrganizationComputeCredits_info @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  },
);
