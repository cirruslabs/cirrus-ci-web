import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import { OwnerQuery } from './__generated__/OwnerQuery.graphql';
import { useParams } from 'react-router-dom';
import OwnerRepositoryList from '../../components/account/OwnerRepositoryList';
import NotFound from '../NotFound';

export default function Owner(): JSX.Element {
  let { platform, owner } = useParams();
  return (
    <QueryRenderer<OwnerQuery>
      environment={environment}
      variables={{ platform, owner }}
      query={graphql`
        query OwnerQuery($platform: String!, $owner: String!) {
          ownerInfoByName(platform: $platform, name: $owner) {
            ...OwnerRepositoryList_info
          }
          viewer {
            ...OwnerRepositoryList_viewer
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.ownerInfoByName) {
          return <NotFound />;
        }
        return <OwnerRepositoryList viewer={props.viewer} info={props.ownerInfoByName} />;
      }}
    />
  );
}
