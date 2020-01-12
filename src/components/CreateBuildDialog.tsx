import React from 'react';
import environment from '../createRelayEnvironment';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { navigateBuild } from '../utils/navigate';

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

const styles = theme =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  onClose: Function;
  open: boolean;
  repository: CreateBuildDialog_repository;
}

interface State {
  branch: string;
  configOverride: string;
  sha: string;
}

class CreateBuildDialog extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      configOverride: '',
      branch: props.repository.masterBranch,
      sha: '',
    };
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onConfigChange = newValue => {
    this.setState(prevState => ({
      ...prevState,
      configOverride: newValue,
    }));
  };

  changeField = field => {
    return event => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  render() {
    let { repository } = this.props;
    return (
      <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Create new build for {repository.owner}/{repository.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Customize parameters for build. (Optional)</DialogContentText>
          <TextField
            margin="dense"
            id="branch"
            onChange={this.changeField('branch')}
            value={this.state.branch}
            label="Branch"
            fullWidth
          />
          <TextField
            margin="dense"
            id="sha"
            onChange={this.changeField('sha')}
            value={this.state.sha}
            label="Optional SHA"
            fullWidth
          />
          <DialogContentText>Optionally, you can override build configuration:</DialogContentText>
          <AceEditor
            mode="yaml"
            theme="github"
            placeholder="Add a custom configuration here to use custom instructions for this build."
            onChange={this.onConfigChange}
            value={this.state.configOverride}
            name="CONFIG_OVERRIDE"
            editorProps={{ $blockScrolling: true }}
            highlightActiveLine={true}
            showGutter={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.sendMutation} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  sendMutation = () => {
    const variables = {
      input: {
        clientMutationId: this.props.repository.name,
        repositoryId: parseInt(this.props.repository.id, 10),
        branch: this.state.branch,
        sha: this.state.sha,
        configOverride: this.state.configOverride,
      },
    };

    console.log(variables);

    commitMutation(environment, {
      mutation: createBuildMutation,
      variables: variables,
      onCompleted: (response: CreateBuildDialogMutationResponse) => {
        console.log(response);
        navigateBuild(this.context.router, null, response.createBuild.build.id);
      },
      onError: err => console.error(err),
    });
  };
}

export default createFragmentContainer(withStyles(styles)(withRouter(CreateBuildDialog)), {
  repository: graphql`
    fragment CreateBuildDialog_repository on Repository {
      id
      owner
      name
      masterBranch
    }
  `,
});
