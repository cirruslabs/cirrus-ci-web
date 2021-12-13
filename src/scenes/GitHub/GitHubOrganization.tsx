import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import GitHubOrganizationRepositoryList from '../../components/account/GitHubOrganizationRepositoryList';
import { GitHubOrganizationQuery } from './__generated__/GitHubOrganizationQuery.graphql';
import { useParams } from 'react-router-dom';

export default function GitHubOrganization(): JSX.Element {
  let { owner } = useParams();
  return (
    <QueryRenderer<GitHubOrganizationQuery>
      environment={environment}
      variables={{ owner }}
      query={graphql`
        query GitHubOrganizationQuery($owner: String!) {
          githubOrganizationInfo(organization: $owner) {
            role
          }
          githubRepositories(owner: $owner) {
            ...LastDefaultBranchBuildRow_repository
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return (
          <GitHubOrganizationRepositoryList
            organization={owner}
            organizationInfo={props.githubOrganizationInfo}
            repositories={props.githubRepositories}
          />
        );
      }}
    />
  );
}
