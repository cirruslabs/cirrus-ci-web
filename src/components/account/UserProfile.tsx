import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Paper from '@material-ui/core/Paper';
import { createStyles, Tooltip, WithStyles, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Icon from '@material-ui/core/Icon';
import GitHubIcon from '@material-ui/icons/GitHub';
import { cirrusColors } from '../../cirrusTheme';
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
import Head from 'react-helmet';

const styles = theme =>
  createStyles({
    title: {
      backgroundColor: cirrusColors.cirrusGrey,
    },
    settingGap: {
      paddingTop: 16,
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
        <Paper elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Your GitHub Organizations on Cirrus CI
            </Typography>
          </Toolbar>
          <Table style={{ tableLayout: 'auto' }}>
            <TableBody>
              {organizations.map(organization => (
                <TableRow
                  key={organization.name}
                  onClick={e => navigate(this.context.router, e, '/github/' + organization.name)}
                  hover={true}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="h6">{organization.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Organization settings">
                      <IconButton
                        onClick={e => navigate(this.context.router, e, '/settings/github/' + organization.name)}
                        className="pull-right"
                      >
                        <Icon>settings</Icon>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }

    return (
      <div>
        <Head>
          <title>Your Profile - Cirrus CI</title>
        </Head>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="h6" color="inherit">
              Profile Settings for {user.githubUserName}
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <Card>
            <CardHeader title="GitHub Settings" />
            <CardContent>
              {githubMarketplaceComponent}
              {trialComponent}
            </CardContent>
            <CardActions>{actionButton}</CardActions>
          </Card>
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <UserComputeCredits user={this.props.user} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <UserApiSettings user={this.props.user} />
        </Paper>
        <div className={classes.settingGap} />
        {organizationsComponent}
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(UserProfile)), {
  user: graphql`
    fragment UserProfile_user on User {
      id
      githubUserName
      githubMarketplacePurchase {
        accountId
        planId
        planName
        onFreeTrial
        freeTrialDaysLeft
      }
      organizations {
        name
        role
      }
      ...UserApiSettings_user
      ...UserComputeCredits_user
    }
  `,
});
