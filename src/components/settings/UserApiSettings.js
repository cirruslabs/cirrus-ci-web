import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import ApiSettingsBase from "./ApiSettingsBase";

const generateNewTokenMutation = graphql`
  mutation UserApiSettingsMutation($input: GenerateNewAccessTokenInput!) {
    generateNewAccessToken(input: $input) {
      token
    }
  }
`;


class UserApiSettings extends React.Component {
  getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-user-api-token-${this.props.user.id}`
      },
    };
  }

  render() {
    return (
      <ApiSettingsBase
        generateNewTokenMutation={generateNewTokenMutation}
        getMutationVariables={this.getMutationVariables.bind(this)}
        apiToken={this.props.user.apiToken}
      />
    );
  }
}

export default createFragmentContainer(UserApiSettings, {
  user: graphql`
    fragment UserApiSettings_user on User {
      id
      apiToken {
        maskedToken
      }
    }
  `,
});
