import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { commitMutation } from 'react-relay';
import environment from '../../createRelayEnvironment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import DialogActions from '@material-ui/core/DialogActions';
import { graphql } from 'babel-plugin-relay/macro';
import {
  CreatePersistentWorkerPoolInput,
  PersistentWorkerPoolsListCreateMutationResponse,
} from './__generated__/PersistentWorkerPoolsListCreateMutation.graphql';
import { navigate } from '../../utils/navigate';
import PropTypes from 'prop-types';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { DeletePersistentWorkerPoolInput } from './__generated__/PersistentWorkerPoolsListDeleteMutation.graphql';
import PoolVisibilityIcon from '../icons/PoolVisibilityIcon';

interface PoolsListState {
  openDialog: boolean;
}

interface PoolsListProps {
  readonly ownerId: number;
  pools: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly enabledForPublic: boolean;
  }>;
}

const deletePoolMutation = graphql`
  mutation PersistentWorkerPoolsListDeleteMutation($input: DeletePersistentWorkerPoolInput!) {
    deletePersistentWorkerPool(input: $input) {
      deletedPoolId
    }
  }
`;

class PersistentWorkerPoolsList extends React.Component<PoolsListProps, PoolsListState> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = { openDialog: false };

  toggleDialog = () => {
    this.setState(prevState => ({
      ...prevState,
      openDialog: !prevState.openDialog,
    }));
  };

  deletePool = poolId => {
    const input: DeletePersistentWorkerPoolInput = {
      clientMutationId: 'delete-persistent-worker-pool-' + poolId,
      poolId: poolId,
    };
    commitMutation(environment, {
      mutation: deletePoolMutation,
      variables: { input: input },
      configs: [
        {
          type: 'NODE_DELETE',
          deletedIDFieldName: 'deletedPoolId',
        },
      ],
      onError: err => console.log(err),
    });
  };

  render() {
    return (
      <Card>
        <CardHeader title="Persistent Worker Pools (Beta)" />
        <CardContent>
          <List>
            {this.props.pools.map(
              pool =>
                pool && (
                  <ListItem
                    key={pool.id}
                    button
                    onClick={() => navigate(this.context.router.history, '', '/pool/' + pool.id)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={pool.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.deletePool(pool.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ),
            )}
          </List>
        </CardContent>
        <CardActions>
          <CreateNewPersistentWorkerPoolDialog
            ownerId={this.props.ownerId}
            open={this.state.openDialog}
            onClose={this.toggleDialog}
          />
          <Button variant="contained" onClick={this.toggleDialog}>
            Create New
          </Button>
        </CardActions>
      </Card>
    );
  }
}

interface DialogProps {
  ownerId: number;
  open: boolean;

  onClose(...args: any[]): void;
}

interface DialogState {
  name: string;
  enabledForPublic: boolean;
}

const createPoolMutation = graphql`
  mutation PersistentWorkerPoolsListCreateMutation($input: CreatePersistentWorkerPoolInput!) {
    createPersistentWorkerPool(input: $input) {
      pool {
        id
      }
    }
  }
`;

class CreateNewPersistentWorkerPoolDialog extends React.Component<DialogProps, DialogState> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props: DialogProps) {
    super(props);
    this.state = {
      name: '',
      enabledForPublic: true,
    };
  }

  changeField = field => {
    return event => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  checkField = field => {
    return event => {
      let value = event.target.checked;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  createPool = () => {
    const input: CreatePersistentWorkerPoolInput = {
      clientMutationId: 'create-persistent-worker-pool-' + this.props.ownerId,
      ownerId: this.props.ownerId,
      name: this.state.name,
      enabledForPublic: this.state.enabledForPublic,
    };
    commitMutation(environment, {
      mutation: createPoolMutation,
      variables: { input: input },
      onCompleted: (response: PersistentWorkerPoolsListCreateMutationResponse) => {
        navigate(this.context.router.history, '', '/pool/' + response.createPersistentWorkerPool.pool.id);
        this.props.onClose();
      },
      onError: err => console.log(err),
    });
  };

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Create Persistent Worker Pool</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormControlLabel
              control={<Switch checked={this.state.enabledForPublic} onChange={this.checkField('enabledForPublic')} />}
              label="Enabled for public"
            />
          </FormControl>
          <Typography variant="subtitle1">
            <p>
              Enabling worker pool for public will allow any public repository of the organization to schedule tasks on
              this pool. Please use with caution and think of security risks involved in this decision!
            </p>
          </Typography>
          <FormControl fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" onChange={this.changeField('name')} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.createPool} disabled={this.state.name === ''} variant="contained">
            Create
          </Button>
          <Button onClick={this.props.onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default PersistentWorkerPoolsList;
