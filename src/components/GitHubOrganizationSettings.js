import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {createFragmentContainer, graphql} from 'react-relay';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Icon from "@material-ui/core/Icon/Icon";
import {cirrusColors} from "../cirrusTheme";
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";


const styles = theme => ({
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  settingGap: {
    paddingTop: 16
  },
  gap: {
    paddingTop: 16
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class GitHubOrganizationSettings extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {info, organization, classes} = this.props;
    let githubMarketplaceComponent = (
      <div>
        <Typography variant="subheading">
          No GitHub Marketplace plan has been configured!
        </Typography>
      </div>
    );
    if (info.purchase) {
      githubMarketplaceComponent = (
        <div className={classes.row}>
          <Typography variant="subheading">
            Purchased GitHub Plan: <b>{info.purchase.planName}</b>
          </Typography>
        </div>
      );
    }
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
          <Card>
            <CardHeader title="GitHub Settings"/>
            <CardContent>
              {githubMarketplaceComponent}
            </CardContent>
            <CardActions>
              <Button variant="contained"
                      href="https://github.com/marketplace/cirrus-ci">
                <Icon className={classes.leftIcon} className="fa fa-github"/>
                Configure
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(GitHubOrganizationSettings)), {
  info: graphql`
    fragment GitHubOrganizationSettings_info on GitHubOrganizationInfo {
      role
      purchase {
        planName
      }
    }
  `,
});
