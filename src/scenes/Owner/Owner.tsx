import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import { OwnerQuery } from './__generated__/OwnerQuery.graphql';
import { useParams } from 'react-router-dom';
import OwnerRepositoryList from '../../components/account/OwnerRepositoryList';
import NotFound from '../NotFound';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function Owner(): JSX.Element {
  let { platform, owner } = useParams();

  const response = useLazyLoadQuery<OwnerQuery>(
    graphql`
      query OwnerQuery($platform: String!, $owner: String!) {
        ownerInfoByName(platform: $platform, name: $owner) {
          ...OwnerRepositoryList_info
          ...AppBreadcrumbs_info
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
      <AppBreadcrumbs info={response.ownerInfoByName} />
      <OwnerRepositoryList info={response.ownerInfoByName} />
    </>
  );
}
