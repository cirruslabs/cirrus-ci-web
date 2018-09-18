import React from 'react';
import Chip from '@material-ui/core/Chip';
import {createFragmentContainer, graphql} from "react-relay";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {cirrusColors} from "../../cirrusTheme";
import Icon from "@material-ui/core/Icon/Icon";

function TaskTransactionChip(props) {
  let {task} = props;
  let {transaction} = task;
  if (!transaction) return <div/>;
  return (
    <Tooltip title={`${transaction.creditsAmount} compute credits were charged for this task`}>
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
      transaction {
        creditsAmount
      }
    }
  `,
});
