import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AceEditor from 'react-ace';
import { useNavigate } from 'react-router-dom';
import { navigateBuildHelper } from '../../utils/navigateHelper';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import { CreateBuildDialog_repository$key } from './__generated__/CreateBuildDialog_repository.graphql';
import {
  CreateBuildDialogMutationResponse,
  CreateBuildDialogMutationVariables,
} from './__generated__/CreateBuildDialogMutation.graphql';

const createBuildMutation = graphql`
  mutation CreateBuildDialogMutation($input: RepositoryCreateBuildInput!) {
    createBuild(input: $input) {
      build {
        id
      }
    }
  }
`;

interface Props {
  onClose: Function;
  open: boolean;
  repository: CreateBuildDialog_repository$key;
}

export default function CreateBuildDialog(props: Props) {
  let repository = useFragment(
    graphql`
      fragment CreateBuildDialog_repository on Repository {
        id
        owner
        name
        masterBranch
      }
    `,
    props.repository,
  );

  let navigate = useNavigate();
  let [branch, setBranch] = useState(repository.masterBranch);
  let [configOverride, setConfigOverride] = useState('');
  let [sha, setSHA] = useState('');

  function handleClose() {
    if (props.onClose) {
      props.onClose();
    }
  }

  function sendMutation() {
    const variables: CreateBuildDialogMutationVariables = {
      input: {
        clientMutationId: repository.name,
        repositoryId: repository.id,
        branch: branch,
        sha: sha,
        configOverride: configOverride,
      },
    };

    commitMutation(environment, {
      mutation: createBuildMutation,
      variables: variables,
      onCompleted: (response: CreateBuildDialogMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        navigateBuildHelper(navigate, null, response.createBuild.build.id);
      },
      onError: err => console.error(err),
    });
  }

  return (
    <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        Create new build for {repository.owner}/{repository.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Customize parameters for build. (Optional)</DialogContentText>
        <TextField
          margin="dense"
          id="branch"
          onChange={event => setBranch(event.target.value)}
          value={branch}
          label="Branch"
          fullWidth
        />
        <TextField
          margin="dense"
          id="sha"
          onChange={event => setSHA(event.target.value)}
          value={sha}
          label="Optional SHA"
          fullWidth
        />
        <DialogContentText>Optionally, you can override build configuration:</DialogContentText>
        <AceEditor
          mode="yaml"
          theme="github"
          placeholder="Add a custom configuration here to use custom instructions for this build."
          onChange={newValue => setConfigOverride(newValue)}
          value={configOverride}
          name="CONFIG_OVERRIDE"
          editorProps={{ $blockScrolling: true }}
          highlightActiveLine={true}
          showGutter={true}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={sendMutation}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
