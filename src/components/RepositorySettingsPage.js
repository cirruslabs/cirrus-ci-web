import PropTypes from 'prop-types';
import React from 'react';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import RepositorySecuredVariables from "./RepositorySecuredVariables";
import RepositorySettings from "./RepositorySettings";
import {createFragmentContainer, graphql} from "react-relay";
import {Typography, withStyles} from "material-ui";
import classNames from 'classnames';
import {cirrusColors} from "../cirrusTheme";

const styles = {
  main: {
    paddingTop: 8
  },
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  settingGap: {
    paddingTop: 16
  },
};

class RepositorySettingsPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {classes} = this.props;

    let repository = this.props.repository;
    console.log(repository);
    return (
      <div className={classNames("container", classes.main)}>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="title" color="inherit">
              {repository.owner + "/" + repository.name + " repository settings"}
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <RepositorySettings {...this.props}/>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <RepositorySecuredVariables {...this.props}/>
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
