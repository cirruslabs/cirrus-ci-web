import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import ViewerTopActiveRepositories from '../../components/account/ViewerTopActiveRepositories';
import Typography from '@material-ui/core/Typography';
import { ViewerTopRepositoriesQuery } from './__generated__/ViewerTopRepositoriesQuery.graphql';

interface Props {
  className?: string;
}

export default (props: Props) => {
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
      render={({ props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.viewer) {
          return (
            <div style={{ margin: '6px' }}>
              <Typography variant="subtitle1">Please sign in to see your active repositories!</Typography>
            </div>
          );
        }
        return <ViewerTopActiveRepositories viewer={props.viewer} />;
      }}
    />
  );
};
