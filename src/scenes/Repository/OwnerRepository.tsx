import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import RepositoryBuildList from '../../components/repositories/RepositoryBuildList';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import NotFound from '../NotFound';
import { OwnerRepositoryQuery } from './__generated__/OwnerRepositoryQuery.graphql';
import { useParams } from 'react-router-dom';
import MarkdownTypography from '../../components/common/MarkdownTypography';

export default function OwnerRepository(): JSX.Element {
  let params = useParams();
  let { platform, owner, name } = params;
  let branch = params['*'];
  return (
    <QueryRenderer<OwnerRepositoryQuery>
      environment={environment}
      variables={{ platform, owner, name, branch }}
      query={graphql`
        query OwnerRepositoryQuery($platform: String!, $owner: String!, $name: String!, $branch: String) {
          ownerRepository(platform: $platform, owner: $owner, name: $name) {
            ...RepositoryBuildList_repository @arguments(branch: $branch)
          }
          viewer {
            ...RepositoryBuildList_viewer
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        if (!props.ownerRepository) {
          let notFoundMessage = (
            <MarkdownTypography
              text={
                'Repository not found! Please [install Cirrus CI](https://cirrus-ci.org/guide/quick-start/) or push a [`.cirrus.yml`](https://cirrus-ci.org/guide/writing-tasks/)!'
              }
            />
          );
          return <NotFound messageComponent={notFoundMessage} />;
        }
        return <RepositoryBuildList viewer={props.viewer} repository={props.ownerRepository} branch={branch} />;
      }}
    />
  );
}
