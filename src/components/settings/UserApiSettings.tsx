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

function UserApiSettings(props: Props) {
  function getMutationVariables() {
    return {
      input: {
        clientMutationId: `generate-user-api-token-${props.user.id}`,
      },
    };
  }

  return (
    <ApiSettingsBase
      generateNewTokenMutation={generateNewTokenMutation}
      getMutationVariables={getMutationVariables}
      maskedToken={props.user.apiToken?.maskedToken}
    />
  );
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
