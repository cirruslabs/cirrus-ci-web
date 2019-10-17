import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import TaskNameChip from '../chips/TaskNameChip';
import TaskDurationChip from '../chips/TaskDurationChip';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core';
import classNames from 'classnames';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import { navigateTask } from '../../utils/navigate';
import { ComputeCreditsTransactionRow_transaction } from './__generated__/ComputeCreditsTransactionRow_transaction.graphql';

const styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  cell: {
    padding: 0,
    height: '100%',
  },
};

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  transaction: ComputeCreditsTransactionRow_transaction;
}

class ComputeCreditsTransactionRow extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { transaction, classes } = this.props;
    let { task, repository } = transaction;
    return (
      <TableRow onClick={e => navigateTask(this.context.router, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
        <TableCell className={classNames(classes.cell)}>
          <TaskNameChip task={task} className={classes.chip} />
          <TaskCreatedChip task={task} className={classes.chip} />
        </TableCell>
        <TableCell className={classes.cell}>
          <RepositoryNameChip repository={repository} className={classes.chip} />
        </TableCell>
        <TableCell className={classes.cell}>
          <TaskDurationChip task={task} className={classes.chip} />
        </TableCell>
        <TableCell className={classes.cell}>
          <Chip
            label={transaction.creditsAmount}
            avatar={<AttachMoneyIcon />}
            className={classNames(classes.chip, 'pull-right')}
          />
        </TableCell>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(ComputeCreditsTransactionRow)), {
  transaction: graphql`
    fragment ComputeCreditsTransactionRow_transaction on AccountTransaction {
      timestamp
      creditsAmount
      task {
        id
        name
        ...TaskCreatedChip_task
        ...TaskDurationChip_task
      }
      repository {
        ...RepositoryNameChip_repository
      }
    }
  `,
});
