import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {createFragmentContainer, graphql} from 'react-relay';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Icon from "@material-ui/core/Icon/Icon";
import {cirrusColors} from "../cirrusTheme";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import classNames from 'classnames';
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import {navigate} from "../utils/navigate";
import IconButton from "@material-ui/core/IconButton/IconButton";
import UserApiSettings from "./settings/UserApiSettings";
import UserComputeCredits from "./compute-credits/UserComputeCredits";


const styles = theme => ({
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  settingGap: {
    paddingTop: 16
  },
  gap: {
    paddingTop: 16
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID = 992;

class UserProfile extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {user, classes} = this.props;
    let githubMarketplaceComponent = (
      <div>
        <Typography variant="subtitle1">
          No GitHub Marketplace plan has been configured!
        </Typography>
      </div>
    );
    let actionButton = (
      <Button variant="contained"
              href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTI=?account=${user.githubUserName}`}>
        <Icon className={classNames(classes.leftIcon, "fa", "fa-github")}/>
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
    if (user.githubMarketplacePurchase && user.githubMarketplacePurchase.planId === PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID) {
      actionButton = (
        <Button variant="contained"
                href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTA=?account=${user.githubUserName}`}>
          <Icon className={classNames(classes.leftIcon, "fa", "fa-github")}/>
          Switch to Free Plan
        </Button>
      );
    }

    let trialComponent = null;
    if (user.githubMarketplacePurchase && user.githubMarketplacePurchase.onFreeTrial && user.githubMarketplacePurchase.freeTrialDaysLeft > 0) {
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
          <Table style={{tableLayout: 'auto'}}>
            <TableBody>
              {
                organizations.map(organization =>
                  <TableRow key={organization.name}
                            onClick={(e) => navigate(this.context.router, e, "/github/" + organization.name)}
                            hover={true}
                            style={{cursor: "pointer"}}>
                    <TableCell>
                      <Typography variant="h6">{organization.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton tooltip="Organization Settings"
                                  onClick={(e) => navigate(this.context.router, e, "/settings/github/" + organization.name)}
                                  className="pull-right">
                        <Icon>settings</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Paper>
      );
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="h6" color="inherit">
              Profile Settings for {user.githubUserName}
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <Card>
            <CardHeader title="GitHub Settings"/>
            <CardContent>
              {githubMarketplaceComponent}
              {trialComponent}
            </CardContent>
            <CardActions>
              {actionButton}
            </CardActions>
          </Card>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <UserComputeCredits user={this.props.user}/>
        </Paper>
        <Paper elevation={1}>
          <UserApiSettings user={this.props.user}/>
        </Paper>
        <div className={classes.settingGap}/>
        {organizationsComponent}
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(UserProfile)), {
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
