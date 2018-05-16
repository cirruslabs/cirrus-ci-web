import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/AccountInformation'
import CirrusCircularProgress from "../../components/CirrusCircularProgress";
import {cirrusColors} from "../../cirrusTheme";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";


class ViewerComponent extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={
          graphql`
          query ViewerComponentQuery {
            viewer {
              ...AccountInformation_viewer
            }
          }
        `
        }

        render={({error, props}) => {
          if (!props) {
            return <CirrusCircularProgress/>
          }
          let viewer = props.viewer;
          if (!viewer) {
            return <Button style={{color: cirrusColors.cirrusWhite}}
                           href="https://api.cirrus-ci.com/redirect/auth/github"
                           icon={<Icon className="fa fa-github"/>}>Log In</Button>;
          }
          return <AccountInformation viewer={viewer}/>;
        }}
      />
    );
  }
}

export default ViewerComponent;
