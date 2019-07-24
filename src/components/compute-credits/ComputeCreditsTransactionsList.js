import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core';
import ComputeCreditsTransactionRow from './ComputeCreditsTransactionRow';

class ComputeCreditsTransactionsList extends React.Component {
  render() {
    let transactions = this.props.transactions || [];
    return (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {transactions.map(transaction => (
            <ComputeCreditsTransactionRow key={transaction.__id} transaction={transaction} />
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles({})(ComputeCreditsTransactionsList);
