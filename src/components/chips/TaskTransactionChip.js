import React from 'react';
import Chip from '@material-ui/core/Chip';
import {createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {cirrusColors} from "../../cirrusTheme";
import Icon from "@material-ui/core/Icon/Icon";

function TaskTransactionChip(props) {
  let {task} = props;
  let {transaction, usedComputeCredits} = task;
  if (!usedComputeCredits) return <div/>;
  let tip = "Exact amount of compute credits used hasn't been calculated yet";
  if (transaction) {
    tip = `${transaction.creditsAmount} compute credits were charged for this task`;
  }
  return (
    <Tooltip title={tip}>
      <Chip {...props}
            label="compute credits"
            avatar={
              <Avatar style={{backgroundColor: cirrusColors.success}}>
                <Icon style={{color: cirrusColors.cirrusWhite}}>star</Icon>
              </Avatar>
            }/>
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
