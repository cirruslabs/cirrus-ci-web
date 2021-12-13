import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import ReactMarkdown from 'react-markdown';
import RepositoryBuildList from '../../components/repositories/RepositoryBuildList';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { GitHubRepositoryQuery } from './__generated__/GitHubRepositoryQuery.graphql';
import { useParams } from 'react-router-dom';

export default function GitHubRepository(): JSX.Element {
  let params = useParams();
  let { owner, name, branch } = params;
  return (
    <QueryRenderer<GitHubRepositoryQuery>
      environment={environment}
      variables={{ owner: owner, name: name, branch: branch }}
      query={graphql`
        query GitHubRepositoryQuery($owner: String!, $name: String!, $branch: String) {
          githubRepository(owner: $owner, name: $name) {
            ...RepositoryBuildList_repository @arguments(branch: $branch)
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.githubRepository) {
          let notFoundMessage = (
            <ReactMarkdown source="Repository not found! Please [install Cirrus CI](https://cirrus-ci.org/guide/quick-start/) or push a [`.cirrus.yml`](https://cirrus-ci.org/guide/writing-tasks/)!" />
          );
          return <NotFound messageComponent={notFoundMessage} />;
        }
        return <RepositoryBuildList repository={props.githubRepository} branch={branch} />;
      }}
    />
  );
}
