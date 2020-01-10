import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { OrganizationComputeCreditsTransactionsList_info } from './__generated__/OrganizationComputeCreditsTransactionsList_info.graphql';

interface Props {
  info: OrganizationComputeCreditsTransactionsList_info;
}

class OrganizationComputeCreditsTransactionsList extends React.Component<Props> {
  render() {
    let transactions = this.props.info.transactions;
    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {transactions.edges.map(edge => (
            <ComputeCreditsTransactionRow key={edge.node.taskId} transaction={edge.node} />
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default createFragmentContainer(OrganizationComputeCreditsTransactionsList, {
  info: graphql`
    fragment OrganizationComputeCreditsTransactionsList_info on GitHubOrganizationInfo
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
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
});
