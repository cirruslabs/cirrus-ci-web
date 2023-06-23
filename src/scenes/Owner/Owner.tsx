import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import OwnerRepositoryList from 'components/account/OwnerRepositoryList';
import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import NotFound from 'scenes/NotFound';

import { OwnerQuery } from './__generated__/OwnerQuery.graphql';

function OwnerFor(platform: string, owner: string) {
  const response = useLazyLoadQuery<OwnerQuery>(
    graphql`
      query OwnerQuery($platform: String!, $owner: String!) {
        ownerInfoByName(platform: $platform, name: $owner) {
          ...OwnerRepositoryList_info
          ...AppBreadcrumbs_info
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { platform, owner },
  );

  if (!response.ownerInfoByName) {
    return <NotFound />;
  }

  return (
    <>
      <AppBreadcrumbs info={response.ownerInfoByName} viewer={response.viewer} />
      <OwnerRepositoryList info={response.ownerInfoByName} />
    </>
  );
}

export default function Owner() {
  let { platform, owner } = useParams();

  if (!platform || !owner) {
    return <NotFound />;
  }

  return OwnerFor(platform, owner);
}
