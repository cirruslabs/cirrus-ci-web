import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Star from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColorsState } from '../../cirrusTheme';
import { isTaskFinalStatus } from '../../utils/status';
import { withTheme } from '@material-ui/core/styles';
import { createFragmentContainer } from 'react-relay';
import { TaskTransactionChip_task } from './__generated__/TaskTransactionChip_task.graphql';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@material-ui/core';

interface Props {
  task: TaskTransactionChip_task;
  className?: string;
}

function TaskTransactionChip(props: Props) {
  let theme = useTheme();
  const cirrusColors = useRecoilValue(cirrusColorsState);

  let task = props.task;
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
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <Star style={{ color: theme.palette.primary.contrastText }} />
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(TaskTransactionChip, {
  task: graphql`
    fragment TaskTransactionChip_task on Task {
      status
      usedComputeCredits
      transaction {
        creditsAmount
        initialCreditsAmount
      }
    }
  `,
});
