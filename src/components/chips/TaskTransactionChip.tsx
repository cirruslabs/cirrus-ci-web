import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Star from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import { graphql } from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';
import { isTaskFinalStatus } from '../../utils/status';
import { withTheme, WithTheme } from '@material-ui/core';
import { createFragmentContainer } from 'react-relay';
import { TaskTransactionChip_task } from './__generated__/TaskTransactionChip_task.graphql';

interface Props extends WithTheme {
  task: TaskTransactionChip_task;
  className?: string;
}

class TaskTransactionChip extends React.Component<Props> {
  render() {
    let { task } = this.props;
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
          className={this.props.className}
          label="compute credits"
          avatar={
            <Avatar style={{ backgroundColor: cirrusColors.success }}>
              <Star style={{ color: this.props.theme.palette.background.paper }} />
            </Avatar>
          }
        />
      </Tooltip>
    );
  }
}

export default createFragmentContainer(withTheme(TaskTransactionChip), {
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
