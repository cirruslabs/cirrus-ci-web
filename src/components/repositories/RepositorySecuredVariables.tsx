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
import { RepositorySecuredVariables_repository } from './__generated__/RepositorySecuredVariables_repository.graphql';
import { RepositorySecuredVariablesMutationResponse } from './__generated__/RepositorySecuredVariablesMutation.graphql';

const securedVariableMutation = graphql`
  mutation RepositorySecuredVariablesMutation($input: RepositorySecuredVariableInput!) {
    securedVariable(input: $input) {
      variableName
    }
  }
`;

interface Props {
  repository: RepositorySecuredVariables_repository;
}

function RepositorySecuredVariables(props: Props) {
  let [inputValue, setInputValue] = useState('');
  let [securedVariable, setSecuredVariable] = useState(undefined);
  let [securedVariableName, setSecuredVariableName] = useState(undefined);

  let securedComponent = null;

  if (securedVariableName) {
    let valueForYAMLFile = `ENCRYPTED[${securedVariableName}]`;

    securedComponent = <CopyPasteField name="securedVariable" fullWidth={true} value={valueForYAMLFile} />;
  }

  function encryptCurrentValue() {
    let valueToSecure = inputValue;
    const variables = {
      input: {
        clientMutationId: props.repository.name, // todo: replace with a hash of valueToSecure
        repositoryId: parseInt(props.repository.id, 10),
        valueToSecure: valueToSecure,
      },
    };

    commitMutation(environment, {
      mutation: securedVariableMutation,
      variables: variables,
      onCompleted: (response: RepositorySecuredVariablesMutationResponse) => {
        setInputValue(valueToSecure);
        setSecuredVariableName(response.securedVariable.variableName);
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Card>
      <CardHeader title="Secured Variables" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <TextField
            name="securedVariableValue"
            placeholder="Enter value to create a secure variable for"
            value={inputValue}
            disabled={securedVariable !== undefined}
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

export default createFragmentContainer(RepositorySecuredVariables, {
  repository: graphql`
    fragment RepositorySecuredVariables_repository on Repository {
      id
      owner
      name
    }
  `,
});
