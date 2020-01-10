import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { UserComputeCreditsTransactionsList_user } from './__generated__/UserComputeCreditsTransactionsList_user.graphql';

interface Props {
  user: UserComputeCreditsTransactionsList_user;
}

class UserComputeCreditsTransactionsList extends React.Component<Props> {
  render() {
    let transactions = this.props.user.transactions;
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

export default createFragmentContainer(UserComputeCreditsTransactionsList, {
  user: graphql`
    fragment UserComputeCreditsTransactionsList_user on User
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
      transactions(last: $count, after: $cursor) @connection(key: "UserComputeCreditsTransactionsList_transactions") {
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
