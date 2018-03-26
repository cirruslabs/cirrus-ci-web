import PropTypes from 'prop-types';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import {withRouter} from 'react-router-dom'

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/AccountInformation'
import CirrusCircularProgress from "../../components/CirrusCircularProgress";
import {cirrusColors} from "../../cirrusTheme";
import {navigate} from "../../utils/navigate";
import {Button, Icon, Toolbar, Typography, withStyles} from "material-ui";

function componentForViewer(props) {
  if (!props) {
    return <CirrusCircularProgress/>
  }
  let viewer = props.viewer;
  if (!viewer) {
    return <Button label="Log In"
                   style={{color: cirrusColors.cirrusWhite}}
                   href="https://api.cirrus-ci.com/redirect/auth/github"
                   icon={<Icon className="fa fa-github"/>}/>
  }
  return <AccountInformation viewer={viewer}/>
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const {classes} = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={
          graphql`
          query HeaderViewerQuery {
            viewer {
              ...AccountInformation_viewer
            }
          }
        `
        }

        render={({error, props}) => {
          return (
            <div className={classes.root}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="title"
                              className={classes.flex}
                              style={{cursor: "pointer"}}
                              onClick={(e) => navigate(this.context.router, e, "/")}
                              color="inherit">
                    Cirrus CI
                  </Typography>
                  <Button className={classes.button}
                          style={{color: cirrusColors.cirrusWhite, marginRight: 8}}
                          href="https://cirrus-ci.org/"
                  >
                    <Icon className={`fa fa-book ${classes.leftIcon}`}/>
                    Documentation
                  </Button>
                  {componentForViewer(props)}
                </Toolbar>
              </AppBar>
            </div>
          );
        }}
      />
    );
  }
}

export default withRouter(withStyles(styles)(Header));
