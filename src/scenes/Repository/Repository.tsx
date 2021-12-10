import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import ReactMarkdown from 'react-markdown';
import RepositoryBuildList from '../../components/repositories/RepositoryBuildList';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { RepositoryQuery } from './__generated__/RepositoryQuery.graphql';
import { useParams } from 'react-router-dom';

export default function Repository(): JSX.Element {
  let { repositoryId, branch } = useParams();
  return (
    <QueryRenderer<RepositoryQuery>
      environment={environment}
      variables={{ repositoryId, branch }}
      query={graphql`
        query RepositoryQuery($repositoryId: ID!, $branch: String) {
          repository(id: $repositoryId) {
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
            <ReactMarkdown source="Repository not found! Please [install Cirrus CI](https://cirrus-ci.org/guide/quick-start/) or push [`.cirrus.yml`!](https://cirrus-ci.org/guide/writing-tasks/)." />
          );
          return <NotFound messageComponent={notFoundMessage} />;
        }
        return <RepositoryBuildList repository={props.repository} />;
      }}
    />
  );
}
