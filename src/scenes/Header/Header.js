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
import {cirrusColors} from "../../cirrusTheme";

function componentForViewer(props) {
  if (!props) {
    return <CirrusCircularProgress/>
  }
  let viewer = props.viewer;
  if (!viewer) {
    return <FlatButton label="Log In"
                       style={{color: cirrusColors.cirrusWhite}}
                       href="https://api.cirrus-ci.com/redirect/auth/github"
                       icon={<FontIcon className="fa fa-github"/>}/>
  }
  return <AccountInformation viewer={viewer}/>
}

class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object
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
          let rightPanel = (
            <div>
              <FlatButton label="Docs"
                          style={{color: cirrusColors.cirrusWhite, marginRight: 8}}
                          href="http://cirrus-ci.org/"
                          icon={<FontIcon className="fa fa-book"/>}/>
              {componentForViewer(props)}
            </div>
          );
          return <AppBar
            title="Cirrus CI Beta"
            titleStyle={{cursor: "pointer"}}
            onTitleClick={() => this.context.router.history.push("/")}
            showMenuIconButton={false}
            iconStyleRight={{marginTop: "auto", marginBottom: "auto"}}
            iconElementRight={rightPanel}
          />
        }}
      />
    );
  }
}

export default withRouter(Header);
