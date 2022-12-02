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
import { Link } from '@mui/material';
import RepositoryDangerSettings from './RepositoryDangerSettings';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

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

  let link = (
    <Link color="inherit" href={`/${repository.platform}/${repository.owner}/${repository.name}`}>
      {repository.owner + '/' + repository.name}
    </Link>
  );
  return (
    <div>
      <AppBreadcrumbs
        ownerName={repository.owner}
        platform={repository.platform}
        repositoryName={repository.name}
        extraCrumbs={[
          {
            name: 'Repository Settings',
            Icon: SettingsOutlinedIcon,
          },
        ]}
      />
      <Paper elevation={16}>
        <Toolbar>
          <Typography variant="h6">
            {'Settings for '} {link}
          </Typography>
        </Toolbar>
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <RepositorySettings repository={repository} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <RepositorySecuredVariables repository={repository} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <RepositoryCronSettings repository={repository} />
      </Paper>
      <div className={classes.settingGap} />
      <Paper elevation={16}>
        <RepositoryDangerSettings repository={repository} />
      </Paper>
    </div>
  );
};

export default createFragmentContainer(withStyles(styles)(RepositorySettingsPage), {
  repository: graphql`
    fragment RepositorySettingsPage_repository on Repository {
      platform
      owner
      name
      ...RepositorySettings_repository
      ...RepositorySecuredVariables_repository
      ...RepositoryCronSettings_repository
      ...RepositoryDangerSettings_repository
    }
  `,
});
