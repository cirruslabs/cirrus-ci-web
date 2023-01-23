import React from 'react';

import {QueryRenderer} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import RepositoryBuildList from '../../components/repositories/RepositoryBuildList';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import {RepositoryQuery} from './__generated__/RepositoryQuery.graphql';
import {useParams} from 'react-router-dom';
import MarkdownTypography from '../../components/common/MarkdownTypography';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

export default function Repository(): JSX.Element {
  let params = useParams();
  let { repositoryId } = params;
  let branch = params['*'];
  return (
    <QueryRenderer<RepositoryQuery>
      environment={environment}
      variables={{ repositoryId, branch }}
      query={graphql`
        query RepositoryQuery($repositoryId: ID!, $branch: String) {
          repository(id: $repositoryId) {
            ...AppBreadcrumbs_repository
            ...RepositoryBuildList_repository @arguments(branch: $branch)
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.repository) {
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
            <AppBreadcrumbs repository={props.repository} />
            <RepositoryBuildList repository={props.repository} />
          </>
        );
      }}
    />
  );
}
