import React from 'react';
import {useNavigate} from 'react-router-dom';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import TaskNameChip from '../chips/TaskNameChip';
import TaskDurationChip from '../chips/TaskDurationChip';
import {createFragmentContainer} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';
import {makeStyles} from '@mui/styles';
import classNames from 'classnames';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TaskCreatedChip from '../chips/TaskCreatedChip';
import {navigateTaskHelper} from '../../utils/navigateHelper';
import {
  ComputeCreditsTransactionRow_transaction
} from './__generated__/ComputeCreditsTransactionRow_transaction.graphql';

const useStyles = makeStyles(theme => {
  return {
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
});

interface Props {
  transaction: ComputeCreditsTransactionRow_transaction;
}

function ComputeCreditsTransactionRow(props: Props) {
  let navigate = useNavigate();
  let { transaction } = props;
  let classes = useStyles();
  let { task, repository } = transaction;
  return (
    <TableRow onClick={e => navigateTaskHelper(navigate, e, task.id)} hover={true} style={{ cursor: 'pointer' }}>
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

export default createFragmentContainer(ComputeCreditsTransactionRow, {
  transaction: graphql`
    fragment ComputeCreditsTransactionRow_transaction on OwnerTransaction {
      timestamp
      creditsAmount
      task {
        id
        name
        ...TaskCreatedChip_task
        ...TaskDurationChip_task
        ...TaskNameChip_task
      }
      repository {
        ...RepositoryNameChip_repository
      }
    }
  `,
});
