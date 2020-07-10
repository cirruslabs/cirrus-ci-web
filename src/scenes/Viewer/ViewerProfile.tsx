import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import Typography from '@material-ui/core/Typography';
import UserProfile from '../../components/account/UserProfile';
import { ViewerProfileQuery } from './__generated__/ViewerProfileQuery.graphql';

export default props => {
  return (
    <QueryRenderer<ViewerProfileQuery>
      environment={environment}
      query={graphql`
        query ViewerProfileQuery {
          viewer {
            ...UserProfile_user
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.viewer) {
          return <Typography variant="subtitle1">Please sign in to see your profile!</Typography>;
        }
        return <UserProfile user={props.viewer} />;
      }}
    />
  );
};
