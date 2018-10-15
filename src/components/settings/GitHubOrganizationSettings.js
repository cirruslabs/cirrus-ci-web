import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {createFragmentContainer, graphql} from 'react-relay';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import {cirrusColors} from "../../cirrusTheme";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import ComputeCredits from "../compute-credits/ComputeCredits";
import GitHubPurchase from "./GitHubPurchase";
import WebHookSettings from "./WebHookSettings";


const styles = theme => ({
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  settingGap: {
    paddingTop: 16
  },
});

class GitHubOrganizationSettings extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {organization, classes} = this.props;
    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="title" color="inherit">
              Settings for {organization} organization
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <GitHubPurchase info={this.props.info}/>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <ComputeCredits info={this.props.info}/>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <WebHookSettings info={this.props.info}/>
        </Paper>
        <div className={classes.settingGap}/>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(GitHubOrganizationSettings)), {
  info: graphql`
    fragment GitHubOrganizationSettings_info on GitHubOrganizationInfo {
      name
      ...GitHubPurchase_info
      ...ComputeCredits_info
      ...WebHookSettings_info
    }
  `,
});
