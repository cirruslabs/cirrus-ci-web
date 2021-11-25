import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CopyPasteField from '../common/CopyPasteField';
import TextField from '@mui/material/TextField';
import {
  OrganizationSecuredVariablesMutationResponse,
  OrganizationSecuredVariablesMutationVariables,
} from './__generated__/OrganizationSecuredVariablesMutation.graphql';
import { OrganizationSecuredVariables_info } from './__generated__/OrganizationSecuredVariables_info.graphql';

const securedVariableMutation = graphql`
  mutation OrganizationSecuredVariablesMutation($input: OrganizationSecuredVariableInput!) {
    securedOrganizationVariable(input: $input) {
      variableName
    }
  }
`;

interface Props {
  info: OrganizationSecuredVariables_info;
}

function OrganizationSecuredVariables(props: Props) {
  let [securedVariableName, setSecuredVariableName] = useState(undefined);
  let [inputValue, setInputValue] = useState('');
  let securedComponent = null;

  if (securedVariableName) {
    let valueForYAMLFile = `ENCRYPTED[${securedVariableName}]`;

    securedComponent = <CopyPasteField name="securedVariable" fullWidth={true} value={valueForYAMLFile} />;
  }

  function encryptCurrentValue() {
    const variables: OrganizationSecuredVariablesMutationVariables = {
      input: {
        clientMutationId: props.info.name,
        organizationId: props.info.id,
        valueToSecure: inputValue,
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onCompleted: (response: OrganizationSecuredVariablesMutationResponse) => {
        setSecuredVariableName(response.securedOrganizationVariable.variableName);
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Card elevation={24}>
      <CardHeader title="Organization-Level Secured Variables" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <TextField
            name="securedVariableValue"
            placeholder="Value to create a secure variable for"
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
            multiline={true}
            fullWidth={true}
          />
          {securedComponent}
        </FormControl>
      </CardContent>
      <CardActions>
        <Button variant="contained" disabled={inputValue === ''} onClick={() => encryptCurrentValue()}>
          Encrypt
        </Button>
      </CardActions>
    </Card>
  );
}

export default createFragmentContainer(OrganizationSecuredVariables, {
  info: graphql`
    fragment OrganizationSecuredVariables_info on GitHubOrganizationInfo {
      id
      name
    }
  `,
});
