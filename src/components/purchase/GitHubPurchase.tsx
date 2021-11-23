import React, { useState } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import GitHubIcon from '@mui/icons-material/GitHub';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
      <Card elevation={24}>
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
