import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';
import { ComputeCreditsTransactionRow_transaction$ref } from './__generated__/ComputeCreditsTransactionRow_transaction.graphql';

interface Props {
  transactions: ReadonlyArray<ComputeCreditsTransactionRow_transaction$ref>;
}

export default (props: Props) => {
  let transactions = props.transactions || [];
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {transactions.map(transaction => (
          <ComputeCreditsTransactionRow key={transaction.__id} transaction={transaction} />
        ))}
      </TableBody>
    </Table>
  );
};
