import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { ComputeCreditsTransactionsList_transactions$key } from './__generated__/ComputeCreditsTransactionsList_transactions.graphql';

interface Props {
  transactions: ComputeCreditsTransactionsList_transactions$key;
}

const ComputeCreditsTransactionsList = (props: Props) => {
  const transactions = useFragment(
    graphql`
      fragment ComputeCreditsTransactionsList_transactions on OwnerTransaction @relay(plural: true) {
        taskId
        ...ComputeCreditsTransactionRow_transaction
      }
    `,
    props.transactions,
  );

  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {transactions.map(transaction => (
          <ComputeCreditsTransactionRow key={transaction.taskId} transaction={transaction} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ComputeCreditsTransactionsList;
