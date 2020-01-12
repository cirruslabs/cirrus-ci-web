import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { FragmentRefs } from 'relay-runtime';

interface Props {
  transactions: ReadonlyArray<{
    readonly taskId: number;
    readonly ' $fragmentRefs': FragmentRefs<'ComputeCreditsTransactionRow_transaction'>;
  }>;
}

export default (props: Props) => {
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
}
