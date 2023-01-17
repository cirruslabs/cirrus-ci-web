import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import { OwnerQuery } from './__generated__/OwnerQuery.graphql';
import { useParams } from 'react-router-dom';
import OwnerRepositoryList from '../../components/account/OwnerRepositoryList';
import NotFound from '../NotFound';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function Owner(): JSX.Element | null {
  let { platform, owner } = useParams();

  if (!platform || !owner) return null;

  return (
    <QueryRenderer<OwnerQuery>
      environment={environment}
      variables={{ platform, owner }}
      query={graphql`
        query OwnerQuery($platform: String!, $owner: String!) {
          ownerInfoByName(platform: $platform, name: $owner) {
            ...OwnerRepositoryList_info
            ...AppBreadcrumbs_info
          }
          viewer {
            ...AppBreadcrumbs_viewer
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
        return (
          <>
            <AppBreadcrumbs info={props.ownerInfoByName} viewer={props.viewer} />
            <OwnerRepositoryList info={props.ownerInfoByName} />
          </>
        );
      }}
    />
  );
}
