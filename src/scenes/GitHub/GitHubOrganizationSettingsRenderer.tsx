import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/CirrusLinearProgress';
import GitHubOrganizationSettings from '../../components/settings/GitHubOrganizationSettings';
import { GitHubOrganizationSettingsRendererQuery } from './__generated__/GitHubOrganizationSettingsRendererQuery.graphql';

export default props => {
  let organization = props.match.params.organization;
  return (
    <QueryRenderer<GitHubOrganizationSettingsRendererQuery>
      environment={environment}
      variables={props.match.params}
      query={graphql`
        query GitHubOrganizationSettingsRendererQuery($organization: String!) {
          githubOrganizationInfo(organization: $organization) {
            ...GitHubOrganizationSettings_info
          }
        }
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return <GitHubOrganizationSettings organization={organization} info={props.githubOrganizationInfo} />;
      }}
    />
  );
};
