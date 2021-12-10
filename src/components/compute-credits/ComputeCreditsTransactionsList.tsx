import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import React from 'react';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { FragmentRefs } from 'relay-runtime';

interface Props {
  transactions: ReadonlyArray<{
    readonly taskId: number;
    readonly ' $fragmentRefs': FragmentRefs<'ComputeCreditsTransactionRow_transaction'>;
  }>;
}

const ComputeCreditsTransactionsList = (props: Props) => {
  let transactions = props.transactions || [];
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
