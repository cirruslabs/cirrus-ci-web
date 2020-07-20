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

class OrganizationApiSettings extends React.Component<Props> {
  getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-api-token-${this.props.info.id}`,
        accountId: this.props.info.id,
      },
    };
  }

  render() {
    return (
      <ApiSettingsBase
        generateNewTokenMutation={generateNewTokenMutation}
        getMutationVariables={this.getMutationVariables.bind(this)}
        apiToken={this.props.info.apiToken}
      />
    );
  }
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
