import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import RepositoryBuildList from '../../components/repositories/RepositoryBuildList';
import NotFound from '../NotFound';
import { OwnerRepositoryQuery } from './__generated__/OwnerRepositoryQuery.graphql';
import { useParams } from 'react-router-dom';
import MarkdownTypography from '../../components/common/MarkdownTypography';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function OwnerRepository(): JSX.Element {
  let params = useParams();
  let { platform, owner, name } = params;
  let branch = params['*'];

  const response = useLazyLoadQuery<OwnerRepositoryQuery>(
    graphql`
      query OwnerRepositoryQuery($platform: String!, $owner: String!, $name: String!, $branch: String) {
        ownerRepository(platform: $platform, owner: $owner, name: $name) {
          ...AppBreadcrumbs_repository
          ...RepositoryBuildList_repository @arguments(branch: $branch)
        }
        viewer {
          ...AppBreadcrumbs_viewer
        }
      }
    `,
    { platform, owner, name, branch },
  );

  if (!response.ownerRepository) {
    let notFoundMessage = (
      <MarkdownTypography
        text={
          'Repository not found! Please [install Cirrus CI](https://cirrus-ci.org/guide/quick-start/) or push a [`.cirrus.yml`](https://cirrus-ci.org/guide/writing-tasks/)!'
        }
      />
    );
    return <NotFound messageComponent={notFoundMessage} />;
  }
  return (
    <>
      <AppBreadcrumbs repository={response.ownerRepository} viewer={response.viewer} branch={branch} />
      <RepositoryBuildList repository={response.ownerRepository} branch={branch} />
    </>
  );
}
