import React, { useState } from 'react';
import environment from '../../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import AceEditor from 'react-ace';
import { useHistory } from 'react-router-dom';
import { navigateBuild } from '../../utils/navigate';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import { CreateBuildDialog_repository } from './__generated__/CreateBuildDialog_repository.graphql';
import { CreateBuildDialogMutationResponse } from './__generated__/CreateBuildDialogMutation.graphql';

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
  repository: CreateBuildDialog_repository;
}

function CreateBuildDialog(props: Props) {
  let history = useHistory();
  let [branch, setBranch] = useState(props.repository.masterBranch);
  let [configOverride, setConfigOverride] = useState('');
  let [sha, setSHA] = useState('');
  let { repository } = props;

  function handleClose() {
    if (props.onClose) {
      props.onClose();
    }
  }

  function sendMutation() {
    const variables = {
      input: {
        clientMutationId: props.repository.name,
        repositoryId: parseInt(props.repository.id, 10),
        branch: branch,
        sha: sha,
        configOverride: configOverride,
      },
    };

    console.log(variables);

    commitMutation(environment, {
      mutation: createBuildMutation,
      variables: variables,
      onCompleted: (response: CreateBuildDialogMutationResponse) => {
        console.log(response);
        navigateBuild(history, null, response.createBuild.build.id);
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

export default createFragmentContainer(CreateBuildDialog, {
  repository: graphql`
    fragment CreateBuildDialog_repository on Repository {
      id
      owner
      name
      masterBranch
    }
  `,
});
