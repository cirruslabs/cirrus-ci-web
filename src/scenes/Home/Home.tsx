import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import ViewerBuildList from '../../components/account/ViewerBuildList';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import WelcomePage from './WelcomePage';
import { HomeViewerQuery } from './__generated__/HomeViewerQuery.graphql';

export default () => {
  return (
    <QueryRenderer<HomeViewerQuery>
      environment={environment}
      query={graphql`
        query HomeViewerQuery {
          viewer {
            ...ViewerBuildList_viewer
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (props.viewer) {
          return <ViewerBuildList viewer={props.viewer} />;
        } else {
          return <WelcomePage />;
        }
      }}
    />
  );
};
