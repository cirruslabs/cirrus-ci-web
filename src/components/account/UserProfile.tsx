import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import GitHubIcon from '@material-ui/icons/GitHub';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { navigate } from '../../utils/navigate';
import IconButton from '@material-ui/core/IconButton';
import UserApiSettings from '../settings/UserApiSettings';
import UserComputeCredits from '../compute-credits/UserComputeCredits';
import { UserProfile_user } from './__generated__/UserProfile_user.graphql';
import { Helmet as Head } from 'react-helmet';
import Settings from '@material-ui/icons/Settings';
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  user: UserProfile_user;
}

class UserProfile extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { user, classes } = this.props;
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
                  onClick={e => navigate(this.context.router.history, e, '/github/' + organization.name)}
                  hover={true}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell style={{ width: '90%' }}>
                    <Typography variant="h6">{organization.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Organization settings">
                      <IconButton
                        onClick={e => navigate(this.context.router.history, e, '/settings/github/' + organization.name)}
                        className="pull-right"
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
        <Paper elevation={1}>
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
        <UserComputeCredits user={this.props.user} />
        <div className={classes.gap} />
        <UserApiSettings user={this.props.user} />
        <div className={classes.gap} />
        <UserPersistentWorkerPools user={this.props.user} />
        <div className={classes.gap} />
        {organizationsComponent}
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(UserProfile)), {
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
