import React, { useState } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import GitHubIcon from '@material-ui/icons/GitHub';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GitHubPurchase_info } from './__generated__/GitHubPurchase_info.graphql';

const styles = theme =>
  createStyles({
    title: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
  });

const ORGANIZATIONAL_PRIVATE_REPOSITORIES_PLAN_ID = 993;

interface Props extends WithStyles<typeof styles> {
  info: GitHubPurchase_info;
}

function GitHubPurchase(props: Props) {
  let [showActiveUsers, setShowActiveUsers] = useState(false);
  let { info, classes } = props;
  let githubMarketplaceComponent = (
    <div>
      <Typography variant="subtitle1">No GitHub Marketplace plan has been configured!</Typography>
    </div>
  );
  let actionButton = (
    <Button
      variant="contained"
      startIcon={<GitHubIcon />}
      href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTM=?account=${info.name}`}
    >
      Purchase Plan for Private Repositories
    </Button>
  );
  let cancelPlanButton = null;
  let viewActiveUsers = null;
  if (info.purchase && info.purchase.planId === ORGANIZATIONAL_PRIVATE_REPOSITORIES_PLAN_ID) {
    githubMarketplaceComponent = (
      <div>
        <Typography variant="subtitle1">
          Purchased GitHub Plan: <b>{info.purchase.planName}</b> for <b>{info.purchase.unitCount}</b> seats
        </Typography>
        <Typography variant="subtitle1">
          Amount of monthly active users under the plan: <b>{info.activeUsersAmount}</b>
        </Typography>
        <Typography variant="subtitle1">
          Available seats: <b>{info.purchase.unitCount - info.activeUsersAmount}</b>
        </Typography>
      </div>
    );
    viewActiveUsers = (
      <Button variant="contained" startIcon={<GroupIcon />} onClick={() => setShowActiveUsers(true)}>
        View Active Users
      </Button>
    );
    actionButton = (
      <Button
        variant="contained"
        startIcon={<GroupAddIcon />}
        href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTM=?account=${info.name}`}
      >
        Add More Seats
      </Button>
    );
    cancelPlanButton = (
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTA=?account=${info.name}`}
      >
        Switch to Free Plan
      </Button>
    );
  }

  let trialComponent = null;
  if (info.purchase && info.purchase.onFreeTrial && info.purchase.freeTrialDaysLeft > 0) {
    trialComponent = (
      <div className={classes.row}>
        <Typography variant="subtitle1">
          Days of Free Trial left: <b>{info.purchase.freeTrialDaysLeft}</b>
        </Typography>
      </div>
    );
  }
  return (
    <div>
      <Card>
        <CardHeader title="GitHub Settings" />
        <CardContent>
          {githubMarketplaceComponent}
          {trialComponent}
        </CardContent>
        <CardActions>
          {cancelPlanButton}
          {viewActiveUsers}
          {actionButton}
        </CardActions>
      </Card>
      <Dialog open={showActiveUsers} onClose={() => setShowActiveUsers(false)}>
        <DialogTitle>Users active in the last 30 days</DialogTitle>
        <DialogContent>
          <DialogContentText>{info.activeUserNames.join('\n')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActiveUsers(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(GitHubPurchase), {
  info: graphql`
    fragment GitHubPurchase_info on GitHubOrganizationInfo {
      name
      role
      activeUsersAmount
      activeUserNames
      purchase {
        planId
        planName
        unitCount
        onFreeTrial
        freeTrialDaysLeft
      }
    }
  `,
});
