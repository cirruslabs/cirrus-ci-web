import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import ApiSettingsBase from "./ApiSettingsBase";

const generateNewTokenMutation = graphql`
  mutation OrganizationApiSettingsMutation($input: GenerateNewAccessTokenInput!) {
    generateNewAccessToken(input: $input) {
      token
    }
  }
`;


class OrganizationApiSettings extends React.Component {
  getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-api-token-${this.props.info.id}`,
        accountId: this.props.info.id
      },
    };
  }

  render() {
    return (
      <ApiSettingsBase
        generateNewTokenMutation={generateNewTokenMutation}
        getMutationVariables={this.getMutationVariables}
        apiToken={this.props.info.apiToken}
      />
    );
  }
}

export default createFragmentContainer(OrganizationApiSettings, {
  info: graphql`
    fragment OrganizationApiSettings_info on GitHubOrganizationInfo {
      id
      role
      apiToken {
        maskedToken
      }
    }
  `,
});
