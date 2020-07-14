import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Paper from '@material-ui/core/Paper';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import OrganizationComputeCredits from '../compute-credits/OrganizationComputeCredits';
import GitHubPurchase from '../purchase/GitHubPurchase';
import WebHookSettings from '../webhooks/WebHookSettings';
import OrganizationApiSettings from './OrganizationApiSettings';
import OrganizationSecuredVariables from './OrganizationSecuredVariables';
import { GitHubOrganizationSettings_info } from './__generated__/GitHubOrganizationSettings_info.graphql';

const styles = theme =>
  createStyles({
    settingGap: {
      paddingTop: 16,
    },
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  info: GitHubOrganizationSettings_info;
  organization: string;
}

class GitHubOrganizationSettings extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { organization, info, classes } = this.props;

    if (!info || info.role === 'none') {
      return <Typography variant="subtitle1">You do not have administrator access on this organization!</Typography>;
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Settings for {organization} organization
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <GitHubPurchase info={info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationComputeCredits info={info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationSecuredVariables info={info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <OrganizationApiSettings info={info} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <WebHookSettings info={info} />
        </Paper>
        <div className={classes.settingGap} />
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(GitHubOrganizationSettings)), {
  info: graphql`
    fragment GitHubOrganizationSettings_info on GitHubOrganizationInfo {
      name
      role
      ...GitHubPurchase_info
      ...OrganizationComputeCredits_info
      ...OrganizationApiSettings_info
      ...OrganizationSecuredVariables_info
      ...WebHookSettings_info
    }
  `,
});
