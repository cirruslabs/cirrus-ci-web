import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import AccountInformation from '../../components/account/AccountInformation';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import { ViewerComponentQuery } from './__generated__/ViewerComponentQuery.graphql';

export default () => {
  return (
    <QueryRenderer<ViewerComponentQuery>
      environment={environment}
      query={graphql`
        query ViewerComponentQuery {
          viewer {
            ...AccountInformation_viewer
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return <AccountInformation viewer={props.viewer} />;
      }}
    />
  );
};
