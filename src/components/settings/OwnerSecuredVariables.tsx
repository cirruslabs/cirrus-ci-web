import React, { useState } from 'react';
import { useMutation, useFragment } from 'react-relay';
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
  OwnerSecuredVariablesMutation,
  OwnerSecuredVariablesMutation$data,
  OwnerSecuredVariablesMutation$variables,
} from './__generated__/OwnerSecuredVariablesMutation.graphql';
import { OwnerSecuredVariables_info$key } from './__generated__/OwnerSecuredVariables_info.graphql';

interface Props {
  info: OwnerSecuredVariables_info$key;
}

export default function OwnerSecuredVariables(props: Props) {
  let info = useFragment(
    graphql`
      fragment OwnerSecuredVariables_info on OwnerInfo {
        platform
        uid
        name
      }
    `,
    props.info,
  );

  let [securedVariableName, setSecuredVariableName] = useState<string | undefined>(undefined);
  let [inputValue, setInputValue] = useState('');
  let securedComponent: null | JSX.Element = null;

  if (securedVariableName) {
    let valueForYAMLFile = `ENCRYPTED[${securedVariableName}]`;

    securedComponent = <CopyPasteField name="securedVariable" fullWidth={true} value={valueForYAMLFile} />;
  }

  const [commitSecuredVariableMutation] = useMutation<OwnerSecuredVariablesMutation>(graphql`
    mutation OwnerSecuredVariablesMutation($input: OwnerSecuredVariableInput!) {
      securedOwnerVariable(input: $input) {
        variableName
      }
    }
  `);
  function encryptCurrentValue() {
    const variables: OwnerSecuredVariablesMutation$variables = {
      input: {
        clientMutationId: info.name,
        platform: info.platform,
        ownerUid: info.uid,
        valueToSecure: inputValue,
      },
    };

    commitSecuredVariableMutation({
      variables: variables,
      onCompleted: (response: OwnerSecuredVariablesMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setSecuredVariableName(response.securedOwnerVariable.variableName);
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Card elevation={24}>
      <CardHeader title="Owner-Level Secured Variables" />
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
