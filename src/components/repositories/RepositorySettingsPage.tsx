import PropTypes from 'prop-types';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import RepositorySecuredVariables from './RepositorySecuredVariables';
import RepositorySettings from './RepositorySettings';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { withStyles, WithStyles } from '@material-ui/core';
import { cirrusColors } from '../../cirrusTheme';
import { RepositorySettingsPage_repository } from '../__generated__/RepositorySettingsPage_repository.graphql';

const styles = {
  title: {
    backgroundColor: cirrusColors.cirrusGrey,
  },
  settingGap: {
    paddingTop: 16,
  },
};

interface Props extends WithStyles<typeof styles> {
  repository: RepositorySettingsPage_repository;
}

class RepositorySettingsPage extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { classes } = this.props;

    let repository = this.props.repository;
    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="h6" color="inherit">
              {repository.owner + '/' + repository.name + ' repository settings'}
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <RepositorySettings {...this.props} />
        </Paper>
        <div className={classes.settingGap} />
        <Paper elevation={1}>
          <RepositorySecuredVariables {...this.props} />
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(RepositorySettingsPage), {
  repository: graphql`
    fragment RepositorySettingsPage_repository on Repository {
      owner
      name
      ...RepositorySecuredVariables_repository
      ...RepositorySettings_repository
    }
  `,
});
