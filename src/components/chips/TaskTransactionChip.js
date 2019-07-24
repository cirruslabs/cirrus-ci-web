import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { cirrusColors } from '../../cirrusTheme';

function TaskTransactionChip(props) {
  let { task } = props;
  let { transaction, usedComputeCredits } = task;
  if (!usedComputeCredits) return <div />;
  let tip = "Exact amount of compute credits used hasn't been calculated yet";
  if (transaction) {
    tip = `${transaction.creditsAmount} compute credits were charged for this task`;
  }
  return (
    <Tooltip title={tip}>
      <Chip
        className={props.className}
        label="compute credits"
        avatar={
          <Avatar style={{ backgroundColor: cirrusColors.success }}>
            <Icon style={{ color: cirrusColors.cirrusWhite }}>star</Icon>
          </Avatar>
        }
      />
    </Tooltip>
  );
}

export default createFragmentContainer(TaskTransactionChip, {
  task: graphql`
    fragment TaskTransactionChip_task on Task {
      usedComputeCredits
      transaction {
        creditsAmount
      }
    }
  `,
});
