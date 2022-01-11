import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import ApiSettingsBase from './ApiSettingsBase';
import { OwnerApiSettings_info } from './__generated__/OwnerApiSettings_info.graphql';
import { GenerateNewOwnerAccessTokenInput } from './__generated__/OwnerApiSettingsMutation.graphql';

const generateNewTokenMutation = graphql`
  mutation OwnerApiSettingsMutation($input: GenerateNewOwnerAccessTokenInput!) {
    generateNewOwnerAccessToken(input: $input) {
      token
    }
  }
`;

interface Props {
  info: OwnerApiSettings_info;
}

function OwnerApiSettings(props: Props) {
  function getMutationVariables() {
    let input: GenerateNewOwnerAccessTokenInput = {
      clientMutationId: `generate-api-token-${props.info.uid}`,
      platform: props.info.platform,
      ownerUid: props.info.uid,
    };
    return { input };
  }

  return (
    <ApiSettingsBase
      generateNewTokenMutation={generateNewTokenMutation}
      getMutationVariables={getMutationVariables}
      maskedToken={props.info.apiToken?.maskedToken}
    />
  );
}

export default createFragmentContainer(OwnerApiSettings, {
  info: graphql`
    fragment OwnerApiSettings_info on OwnerInfo {
      platform
      uid
      apiToken {
        maskedToken
      }
    }
  `,
});
