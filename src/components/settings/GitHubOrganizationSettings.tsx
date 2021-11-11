import React from 'react';
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
import OrganizationPersistentWorkerPools from './OrganizationPersistentWorkerPools';
import { GitHubOrganizationSettings_info } from './__generated__/GitHubOrganizationSettings_info.graphql';

const styles = theme =>
  createStyles({
    title: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    settingGap: {
      paddingTop: 16,
    },
  });

interface Props extends WithStyles<typeof styles> {
  info: GitHubOrganizationSettings_info;
  organization: string;
}

function GitHubOrganizationSettings(props: Props) {
  let { organization, info, classes } = props;

  if (!info) {
    return <Typography variant="subtitle1">Can't find information this organization!</Typography>;
  }

  if (info.role === 'none') {
    return <Typography variant="subtitle1">You do not have administrator access on this organization!</Typography>;
  }

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
        <OrganizationPersistentWorkerPools info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <WebHookSettings info={info} />
      </Paper>
      <div className={classes.settingGap} />
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(GitHubOrganizationSettings), {
  info: graphql`
    fragment GitHubOrganizationSettings_info on GitHubOrganizationInfo {
      name
      role
      ...GitHubPurchase_info
      ...OrganizationComputeCredits_info
      ...OrganizationApiSettings_info
      ...OrganizationSecuredVariables_info
      ...OrganizationPersistentWorkerPools_info
      ...WebHookSettings_info
    }
  `,
});
