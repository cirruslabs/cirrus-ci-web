import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import {Typography} from "@material-ui/core";
import GitHubOrganizationSettings from "../../components/GitHubOrganizationSettings";


const GitHubOrganizationSettingsRenderer = (props) => {
  let organization = props.match.params.organization;
  return (
    <QueryRenderer
      environment={environment}
      variables={props.match.params}
      query={
        graphql`
          query GitHubOrganizationSettingsRendererQuery($organization: String!) {
            githubOrganizationInfo(organization: $organization) {
              ...GitHubOrganizationSettings_info
            }
          }
        `
      }

      render={({error, props}) => {
        if (!props) {
          return <CirrusLinearProgress/>;
        }
        if (props.githubOrganizationInfo === null || props.githubOrganizationInfo.role === "none") {
          return <Typography variant="subheading">You are not an admin on this organization!</Typography>;
        }
        return <GitHubOrganizationSettings organization={organization} info={props.githubOrganizationInfo}/>;
      }}
    />
  );
}


export default GitHubOrganizationSettingsRenderer;
