import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import ViewerTopActiveRepositories from "../../components/ViewerTopActiveRepositories";


class ViewerTopRepositories extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={
          graphql`
          query ViewerTopRepositoriesQuery {
            viewer {
              ...ViewerTopActiveRepositories_repositories
            }
          }
        `
        }

        render={({error, props}) => {
          if (!props) {
            return <CirrusLinearProgress/>;
          }
          return <ViewerTopActiveRepositories viewer={props.viewer}/>;
        }}
      />
    );
  }
}

export default ViewerTopRepositories;
