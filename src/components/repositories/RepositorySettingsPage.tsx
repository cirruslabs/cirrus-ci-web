import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import RepositorySecuredVariables from './RepositorySecuredVariables';
import RepositorySettings from './RepositorySettings';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { withStyles, WithStyles } from '@material-ui/core/styles';
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
        <RepositorySettings {...props} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <RepositorySecuredVariables {...props} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={1}>
        <RepositoryCronSettings {...props} />
      </Paper>
    </div>
  );
};

export default createFragmentContainer(withStyles(styles)(RepositorySettingsPage), {
  repository: graphql`
    fragment RepositorySettingsPage_repository on Repository {
      owner
      name
      ...RepositorySecuredVariables_repository
      ...RepositorySettings_repository
      ...RepositoryCronSettings_repository
    }
  `,
});
