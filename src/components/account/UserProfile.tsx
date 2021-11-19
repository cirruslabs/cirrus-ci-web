import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
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
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { navigateHelper } from '../../utils/navigateHelper';
import IconButton from '@mui/material/IconButton';
import UserApiSettings from '../settings/UserApiSettings';
import UserComputeCredits from '../compute-credits/UserComputeCredits';
import { UserProfile_user } from './__generated__/UserProfile_user.graphql';
import { Helmet as Head } from 'react-helmet';
import Settings from '@mui/icons-material/Settings';
import UserPersistentWorkerPools from '../settings/UserPersistentWorkerPools';

const styles = theme =>
  createStyles({
    title: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    gap: {
      paddingTop: 16,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
  });

const PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID = 992;

interface Props extends WithStyles<typeof styles> {
  user: UserProfile_user;
}

function UserProfile(props: Props) {
  let navigate = useNavigate();

  let { user, classes } = props;
  let githubMarketplaceComponent = (
    <div>
      <Typography variant="subtitle1">No GitHub Marketplace plan has been configured!</Typography>
    </div>
  );
  let actionButton = (
    <Button
      variant="contained"
      startIcon={<GitHubIcon />}
      href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTI=?account=${user.githubUserName}`}
    >
      Purchase Plan for Private Repositories
    </Button>
  );
  if (user.githubMarketplacePurchase) {
    githubMarketplaceComponent = (
      <div className={classes.row}>
        <Typography variant="subtitle1">
          Purchased GitHub Plan: <b>{user.githubMarketplacePurchase.planName}</b>
        </Typography>
      </div>
    );
  }
  if (
    user.githubMarketplacePurchase &&
    user.githubMarketplacePurchase.planId === PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID
  ) {
    actionButton = (
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTA=?account=${user.githubUserName}`}
      >
        Switch to Free Plan
      </Button>
    );
  }

  let trialComponent = null;
  if (
    user.githubMarketplacePurchase &&
    user.githubMarketplacePurchase.onFreeTrial &&
    user.githubMarketplacePurchase.freeTrialDaysLeft > 0
  ) {
    trialComponent = (
      <div className={classes.row}>
        <Typography variant="subtitle1">
          Days of Free Trial left: <b>{user.githubMarketplacePurchase.freeTrialDaysLeft}</b>
        </Typography>
      </div>
    );
  }

  let organizationsComponent = null;
  let organizations = user.organizations || [];
  if (organizations.length > 0) {
    organizationsComponent = (
      <Card>
        <CardHeader title="Your GitHub Organizations" />
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {organizations.map(organization => (
              <TableRow
                key={organization.name}
                onClick={e => navigateHelper(navigate, e, '/github/' + organization.name)}
                hover={true}
                style={{ cursor: 'pointer' }}
              >
                <TableCell style={{ width: '90%' }}>
                  <Typography variant="h6">{organization.name}</Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="Organization settings">
                    <IconButton
                      onClick={e => navigateHelper(navigate, e, '/settings/github/' + organization.name)}
                      className="pull-right"
                      size="large"
                    >
                      <Settings />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <div>
      <Head>
        <title>Settings - Cirrus CI</title>
      </Head>
      <Paper elevation={16}>
        <Toolbar className={classes.title}>
          <Typography variant="h6" color="inherit">
            Settings for {user.githubUserName}
          </Typography>
        </Toolbar>
      </Paper>
      <div className={classes.gap} />
      <Card>
        <CardHeader title="GitHub Settings" />
        <CardContent>
          {githubMarketplaceComponent}
          {trialComponent}
        </CardContent>
        <CardActions>{actionButton}</CardActions>
      </Card>
      <div className={classes.gap} />
      <UserComputeCredits user={props.user} />
      <div className={classes.gap} />
      <UserApiSettings user={props.user} />
      <div className={classes.gap} />
      <UserPersistentWorkerPools user={props.user} />
      <div className={classes.gap} />
      {organizationsComponent}
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(UserProfile), {
  user: graphql`
    fragment UserProfile_user on User {
      githubUserName
      githubMarketplacePurchase {
        planId
        planName
        onFreeTrial
        freeTrialDaysLeft
      }
      organizations {
        name
      }
      ...UserApiSettings_user
      ...UserComputeCredits_user
      ...UserPersistentWorkerPools_user
    }
  `,
});
