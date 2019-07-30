import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import ViewerTopActiveRepositories from '../../components/ViewerTopActiveRepositories';
import { Typography } from '@material-ui/core';
import { ViewerTopRepositoriesQuery } from './__generated__/ViewerTopRepositoriesQuery.graphql';

interface Props {
  className?: string;
}

class ViewerTopRepositories extends React.Component<Props> {
  render() {
    return (
      <QueryRenderer<ViewerTopRepositoriesQuery>
        environment={environment}
        query={graphql`
          query ViewerTopRepositoriesQuery {
            viewer {
              ...ViewerTopActiveRepositories_viewer
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (!props) {
            return <CirrusLinearProgress />;
          }
          if (!props.viewer) {
            return (
              <div style={{ alignContent: 'center' }}>
                <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>
              </div>
            );
          }
          return <ViewerTopActiveRepositories viewer={props.viewer} />;
        }}
      />
    );
  }
}

export default ViewerTopRepositories;
