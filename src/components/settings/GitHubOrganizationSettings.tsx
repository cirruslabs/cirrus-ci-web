import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Paper from '@mui/material/Paper';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
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
      <Paper elevation={16}>
        <Toolbar className={classes.title}>
          <Typography variant="h6" color="inherit">
            Settings for {organization} organization
          </Typography>
        </Toolbar>
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <GitHubPurchase info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OrganizationComputeCredits info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OrganizationSecuredVariables info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OrganizationApiSettings info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <OrganizationPersistentWorkerPools info={info} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
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
