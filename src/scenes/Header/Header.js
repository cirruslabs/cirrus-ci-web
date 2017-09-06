import PropTypes from 'prop-types';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {withRouter} from 'react-router-dom'

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/AccountInformation'
import CirrusCircularProgress from "../../components/CirrusCircularProgress";

function componentForViewer(props) {
  if (!props) {
    return <CirrusCircularProgress/>
  }
  let viewer = props.viewer;
  if (!viewer) {
    return <FlatButton label="Log In"
      href="http://api.cirrus-ci.org/redirect/auth/github"
      icon={<FontIcon className="fa fa-github" />}/>
  }
  return <AccountInformation viewer={viewer}/>
}

class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    onIconButtonTouch: PropTypes.func,
  };

  render() {
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
          return <AppBar
            title="Cirrus CI"
            titleStyle={{ cursor: "pointer" }}
            onTitleTouchTap={() => this.context.router.history.push("/")}
            onLeftIconButtonTouchTap={this.props.onIconButtonTouch}
            iconStyleRight={{marginTop: "auto", marginBottom: "auto"}}
            iconElementRight={componentForViewer(props)}
          />
        }}
      />
    );
  }
}

export default withRouter(Header);
