import React from 'react';

import {QueryRenderer} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import ViewerTopActiveRepositories from "../../components/ViewerTopActiveRepositories";
import {Typography} from "@material-ui/core";


class ViewerTopRepositories extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={
          graphql`
          query ViewerTopRepositoriesQuery {
            viewer {
              ...ViewerTopActiveRepositories_viewer
            }
          }
        `
        }

        render={({error, props}) => {
          if (!props) {
            return <CirrusLinearProgress/>;
          }
          if (!props.viewer) {
            return <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>;
          }
          return <ViewerTopActiveRepositories viewer={props.viewer}/>;
        }}
      />
    );
  }
}

export default ViewerTopRepositories;
