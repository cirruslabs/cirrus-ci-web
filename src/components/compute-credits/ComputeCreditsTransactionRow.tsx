import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';

import RepositoryNameChip from 'components/chips/RepositoryNameChip';
import TaskCreatedChip from 'components/chips/TaskCreatedChip';
import TaskDurationChip from 'components/chips/TaskDurationChip';
import TaskNameChip from 'components/chips/TaskNameChip';
import { navigateTaskHelper } from 'utils/navigateHelper';

import { ComputeCreditsTransactionRow_transaction$key } from './__generated__/ComputeCreditsTransactionRow_transaction.graphql';

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
  transaction: ComputeCreditsTransactionRow_transaction$key;
}

export default function ComputeCreditsTransactionRow(props: Props) {
  let transaction = useFragment(
    graphql`
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
    props.transaction,
  );

  let navigate = useNavigate();
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
