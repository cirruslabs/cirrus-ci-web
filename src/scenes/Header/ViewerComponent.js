import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/AccountInformation'
import CirrusCircularProgress from "../../components/CirrusCircularProgress";
import {cirrusColors} from "../../cirrusTheme";
import {Button, Icon} from "material-ui";


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
            return <Button label="Log In"
                           style={{color: cirrusColors.cirrusWhite}}
                           href="https://api.cirrus-ci.com/redirect/auth/github"
                           icon={<Icon className="fa fa-github"/>}/>;
          }
          return <AccountInformation viewer={viewer}/>;
        }}
      />
    );
  }
}

export default ViewerComponent;
