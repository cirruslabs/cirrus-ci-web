import React from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { Link } from '@mui/material';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import RepositoryCronSettings from './RepositoryCronSettings';
import RepositoryDangerSettings from './RepositoryDangerSettings';
import RepositorySecuredVariables from './RepositorySecuredVariables';
import RepositorySettings from './RepositorySettings';
import { RepositorySettingsPage_repository$key } from './__generated__/RepositorySettingsPage_repository.graphql';

const useStyles = makeStyles(theme => {
  return {
    settingGap: {
      paddingTop: 16,
    },
  };
});

interface Props {
  repository: RepositorySettingsPage_repository$key;
}

export default function RepositorySettingsPage(props: Props) {
  let repository = useFragment(
    graphql`
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
    props.repository,
  );

  let classes = useStyles();

  let link = (
    <Link color="inherit" href={`/${repository.platform}/${repository.owner}/${repository.name}`}>
      {repository.owner + '/' + repository.name}
    </Link>
  );
  return (
    <div>
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
}
