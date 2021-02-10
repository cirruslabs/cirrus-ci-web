import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import CopyPasteField from '../common/CopyPasteField';
import TextField from '@material-ui/core/TextField';
import { OrganizationSecuredVariablesMutationResponse } from './__generated__/OrganizationSecuredVariablesMutation.graphql';
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
    const variables = {
      input: {
        clientMutationId: props.info.name,
        organizationId: parseInt(props.info.id, 10),
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
    <Card>
      <CardHeader title="Organization-Level Secured Variables" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <TextField
            name="securedVariableValue"
            placeholder="Value to create a secure variable for"
            value={inputValue}
            disabled={securedVariableName !== undefined}
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
