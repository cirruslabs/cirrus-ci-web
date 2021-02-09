import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ApiSettingsBase from './ApiSettingsBase';
import { OrganizationApiSettings_info } from './__generated__/OrganizationApiSettings_info.graphql';

const generateNewTokenMutation = graphql`
  mutation OrganizationApiSettingsMutation($input: GenerateNewAccessTokenInput!) {
    generateNewAccessToken(input: $input) {
      token
    }
  }
`;

interface Props {
  info: OrganizationApiSettings_info;
}

function OrganizationApiSettings(props: Props) {
  function getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-api-token-${props.info.id}`,
        accountId: props.info.id,
      },
    };
  }

  return (
    <ApiSettingsBase
      generateNewTokenMutation={generateNewTokenMutation}
      getMutationVariables={getMutationVariables}
      maskedToken={props.info.apiToken?.maskedToken}
    />
  );
}

export default createFragmentContainer(OrganizationApiSettings, {
  info: graphql`
    fragment OrganizationApiSettings_info on GitHubOrganizationInfo {
      id
      apiToken {
        maskedToken
      }
    }
  `,
});
