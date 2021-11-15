import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../../components/common/CirrusLinearProgress';
import GitHubOrganizationSettings from '../../components/settings/GitHubOrganizationSettings';
import { GitHubOrganizationSettingsRendererQuery } from './__generated__/GitHubOrganizationSettingsRendererQuery.graphql';
import { useParams } from 'react-router-dom';

export default () => {
  let { organization } = useParams();
  return (
    <QueryRenderer<GitHubOrganizationSettingsRendererQuery>
      environment={environment}
      variables={{ organization }}
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
