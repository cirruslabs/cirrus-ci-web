import React from 'react';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import RepositorySecuredVariables from './RepositorySecuredVariables';
import RepositorySettings from './RepositorySettings';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import { RepositorySettingsPage_repository } from './__generated__/RepositorySettingsPage_repository.graphql';
import RepositoryCronSettings from './RepositoryCronSettings';

const styles = {
  settingGap: {
    paddingTop: 16,
  },
};

interface Props extends WithStyles<typeof styles> {
  repository: RepositorySettingsPage_repository;
}

let RepositorySettingsPage = (props: Props) => {
  let { classes, repository } = props;

  return (
    <div>
      <Paper elevation={1}>
        <Toolbar>
          <Typography variant="h6">{'Settings for ' + repository.owner + '/' + repository.name}</Typography>
        </Toolbar>
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <RepositorySettings repository={repository} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <RepositorySecuredVariables repository={repository} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <RepositoryCronSettings repository={repository} />
      </Paper>
    </div>
  );
};

export default createFragmentContainer(withStyles(styles)(RepositorySettingsPage), {
  repository: graphql`
    fragment RepositorySettingsPage_repository on Repository {
      owner
      name
      ...RepositorySettings_repository
      ...RepositorySecuredVariables_repository
      ...RepositoryCronSettings_repository
    }
  `,
});
