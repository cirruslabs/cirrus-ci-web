import React, { useState } from 'react';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CopyPasteField from '../common/CopyPasteField';
import TextField from '@mui/material/TextField';
import { RepositorySecuredVariables_repository$key } from './__generated__/RepositorySecuredVariables_repository.graphql';
import {
  RepositorySecuredVariablesMutation,
  RepositorySecuredVariablesMutationResponse,
  RepositorySecuredVariablesMutationVariables,
} from './__generated__/RepositorySecuredVariablesMutation.graphql';

interface Props {
  repository: RepositorySecuredVariables_repository$key;
}

export default function RepositorySecuredVariables(props: Props) {
  let repository = useFragment(
    graphql`
      fragment RepositorySecuredVariables_repository on Repository {
        id
        owner
        name
      }
    `,
    props.repository,
  );

  let [inputValue, setInputValue] = useState('');
  let [securedVariableName, setSecuredVariableName] = useState(undefined);

  let securedComponent = null;

  if (securedVariableName) {
    let valueForYAMLFile = `ENCRYPTED[${securedVariableName}]`;

    securedComponent = <CopyPasteField name="securedVariable" fullWidth={true} value={valueForYAMLFile} />;
  }

  const [commitSecuredVariableMutation] = useMutation<RepositorySecuredVariablesMutation>(graphql`
    mutation RepositorySecuredVariablesMutation($input: RepositorySecuredVariableInput!) {
      securedVariable(input: $input) {
        variableName
      }
    }
  `);
  function encryptCurrentValue() {
    let valueToSecure = inputValue;
    const variables: RepositorySecuredVariablesMutationVariables = {
      input: {
        clientMutationId: repository.name, // todo: replace with a hash of valueToSecure
        repositoryId: repository.id,
        valueToSecure: valueToSecure,
      },
    };

    commitSecuredVariableMutation({
      variables: variables,
      onCompleted: (response: RepositorySecuredVariablesMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setInputValue(valueToSecure);
        setSecuredVariableName(response.securedVariable.variableName);
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Card elevation={24}>
      <CardHeader title="Secured Variables" />
      <CardContent>
        <FormControl style={{ width: '100%' }}>
          <TextField
            name="securedVariableValue"
            placeholder="Enter value to create a secure variable for"
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
