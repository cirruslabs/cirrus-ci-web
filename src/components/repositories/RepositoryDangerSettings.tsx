import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import { RepositoryDangerSettings_repository } from './__generated__/RepositoryDangerSettings_repository.graphql';
import { navigateHelper } from '../../utils/navigateHelper';
import { useNavigate } from 'react-router-dom';
import {
  RepositoryDangerSettingsDeleteMutationResponse,
  RepositoryDangerSettingsDeleteMutationVariables,
} from './__generated__/RepositoryDangerSettingsDeleteMutation.graphql';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import { FormHelperText, ListItem, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import List from '@mui/material/List';

const deleteMutation = graphql`
  mutation RepositoryDangerSettingsDeleteMutation($input: RepositoryDeleteInput!) {
    deleteRepository(input: $input) {
      deleted
    }
  }
`;

interface Props {
  repository: RepositoryDangerSettings_repository;
}

function RepositoryDangerSettings(props: Props) {
  let navigate = useNavigate();
  let [inputValue, setInputValue] = useState('');
  let [securedVariableName, setSecuredVariableName] = useState(undefined);

  function deleteCurrentRepository() {
    let valueToSecure = inputValue;
    const variables: RepositoryDangerSettingsDeleteMutationVariables = {
      input: {
        clientMutationId: props.repository.name, // todo: replace with a hash of valueToSecure
        repositoryId: props.repository.id,
      },
    };

    commitMutation(environment, {
      mutation: deleteMutation,
      variables: variables,
      onCompleted: (response: RepositoryDangerSettingsDeleteMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
        } else {
          navigateHelper(navigate, null, '/');
        }
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Card elevation={24}>
      <CardHeader title="Danger Zone" />
      <CardContent>
        <List>
          <ListItem
            secondaryAction={
              <Button variant="contained" color="warning" onClick={() => deleteCurrentRepository()}>
                Delete
              </Button>
            }
            disablePadding
          >
            <ListItemText
              primary="Delete this repository"
              secondary="Once you delete a repository, there is no going back. Please be certain."
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default createFragmentContainer(RepositoryDangerSettings, {
  repository: graphql`
    fragment RepositoryDangerSettings_repository on Repository {
      id
      owner
      name
    }
  `,
});
