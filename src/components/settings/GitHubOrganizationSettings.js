import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { cirrusColors } from '../../cirrusTheme';
import Toolbar from '@material-ui/core/Toolbar';
import OrganizationComputeCredits from '../compute-credits/OrganizationComputeCredits';
import GitHubPurchase from '../purchase/GitHubPurchase';
import WebHookSettings from '../webhooks/WebHookSettings';
import OrganizationApiSettings from './OrganizationApiSettings';
import OrganizationSecuredVariables from '../OrganizationSecuredVariables';

const styles = theme => ({
  title: {
    backgroundColor: cirrusColors.cirrusGrey,
  },
  settingGap: {
    paddingTop: 16,
  },
});

class GitHubOrganizationSettings extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { organization, classes } = this.props;
    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="h6" color="inherit">
              Settings for {organization} organization
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <GitHubPurchase info={this.props.info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationComputeCredits info={this.props.info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationSecuredVariables info={this.props.info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationApiSettings info={this.props.info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <WebHookSettings info={this.props.info} />
        </Paper>
        <div className={classes.settingGap} />
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(GitHubOrganizationSettings)), {
  info: graphql`
    fragment GitHubOrganizationSettings_info on GitHubOrganizationInfo {
      name
      ...GitHubPurchase_info
      ...OrganizationComputeCredits_info
      ...OrganizationApiSettings_info
      ...OrganizationSecuredVariables_info
      ...WebHookSettings_info
    }
  `,
});
