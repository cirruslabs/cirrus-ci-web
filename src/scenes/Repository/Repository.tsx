import React from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { useParams } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import AppBreadcrumbs from 'components/common/AppBreadcrumbs';
import MarkdownTypography from 'components/common/MarkdownTypography';
import RepositoryBuildList from 'components/repositories/RepositoryBuildList';
import NotFound from 'scenes/NotFound';

import { RepositoryQuery } from './__generated__/RepositoryQuery.graphql';

function RepositoryById(repositoryId: string, branch?: string) {
  const response = useLazyLoadQuery<RepositoryQuery>(
    graphql`
      query RepositoryQuery($repositoryId: ID!, $branch: String) {
        repository(id: $repositoryId) {
          ...AppBreadcrumbs_repository
          ...RepositoryBuildList_repository @arguments(branch: $branch)
        }
      }
    `,
    { repositoryId, branch },
  );

  if (!response.repository) {
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
      <AppBreadcrumbs repository={response.repository} />
      <RepositoryBuildList repository={response.repository} />
    </>
  );
}

export default function Repository() {
  let params = useParams();
  let { repositoryId } = params;

  if (!repositoryId) {
    return <NotFound />;
  }

  return RepositoryById(repositoryId, params['*']);
}
