import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ApiSettingsBase from './ApiSettingsBase';
import { UserApiSettings_user } from './__generated__/UserApiSettings_user.graphql';

const generateNewTokenMutation = graphql`
  mutation UserApiSettingsMutation($input: GenerateNewAccessTokenInput!) {
    generateNewAccessToken(input: $input) {
      token
    }
  }
`;

interface Props {
  user: UserApiSettings_user;
}

class UserApiSettings extends React.Component<Props> {
  getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-user-api-token-${this.props.user.id}`,
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
