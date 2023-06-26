import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { useFragment, useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import { navigateBuildHelper } from 'utils/navigateHelper';

import {
  CreateBuildDialogMutation,
  CreateBuildDialogMutation$data,
  CreateBuildDialogMutation$variables,
} from './__generated__/CreateBuildDialogMutation.graphql';
import { CreateBuildDialog_repository$key } from './__generated__/CreateBuildDialog_repository.graphql';

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

  const [commitCreateBuildMutation] = useMutation<CreateBuildDialogMutation>(
    graphql`
      mutation CreateBuildDialogMutation($input: RepositoryCreateBuildInput!) {
        createBuild(input: $input) {
          build {
            id
          }
        }
      }
    `,
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
    const variables: CreateBuildDialogMutation$variables = {
      input: {
        clientMutationId: repository.name,
        repositoryId: repository.id,
        branch: branch,
        sha: sha,
        configOverride: configOverride,
      },
    };

    commitCreateBuildMutation({
      variables: variables,
      onCompleted: (response: CreateBuildDialogMutation$data, errors) => {
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
    <mui.Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <mui.DialogTitle id="form-dialog-title">
        Create new build for {repository.owner}/{repository.name}
      </mui.DialogTitle>
      <mui.DialogContent>
        <mui.DialogContentText>Customize parameters for build. (Optional)</mui.DialogContentText>
        <mui.TextField
          margin="dense"
          id="branch"
          onChange={event => setBranch(event.target.value)}
          value={branch}
          label="Branch"
          fullWidth
        />
        <mui.TextField
          margin="dense"
          id="sha"
          onChange={event => setSHA(event.target.value)}
          value={sha}
          label="Optional SHA"
          fullWidth
        />
        <mui.DialogContentText>Optionally, you can override build configuration:</mui.DialogContentText>
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
      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={handleClose}>Cancel</mui.Button>
        <mui.Button onClick={sendMutation}>Create</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
}
