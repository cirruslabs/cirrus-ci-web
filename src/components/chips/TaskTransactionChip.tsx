import React from 'react';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Star from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import { isTaskFinalStatus } from '../../utils/status';
import { useFragment } from 'react-relay';
import { TaskTransactionChip_task$key } from './__generated__/TaskTransactionChip_task.graphql';
import { useTheme } from '@mui/material';

interface Props {
  task: TaskTransactionChip_task$key;
  className?: string;
}

export default function TaskTransactionChip(props: Props) {
  let task = useFragment(
    graphql`
      fragment TaskTransactionChip_task on Task {
        status
        usedComputeCredits
        transaction {
          creditsAmount
          initialCreditsAmount
        }
      }
    `,
    props.task,
  );

  let theme = useTheme();

  let { transaction, usedComputeCredits } = task;
  if (!usedComputeCredits) {
    return <div />;
  }

  let tip = isTaskFinalStatus(task.status)
    ? 'No compute credits were charged!'
    : 'Compute credit cost will be calculated at the end of the task.';
  if (transaction) {
    tip = `${transaction.creditsAmount} compute credits were charged for this task.`;
  }

  if (transaction && transaction.initialCreditsAmount) {
    tip += ` (corrected from ${transaction.initialCreditsAmount})`;
  }

  return (
    <Tooltip title={tip}>
      <Chip
        className={props.className}
        label="compute credits"
        avatar={
          <Avatar style={{ backgroundColor: theme.palette.info.main }}>
            <Star style={{ color: theme.palette.primary.contrastText }} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}
