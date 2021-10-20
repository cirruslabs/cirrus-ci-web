import React, { useState } from 'react';
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
import { useHistory } from 'react-router-dom';

interface PoolsListState {
  openDialog: boolean;
}

interface PoolsListProps {
  readonly ownerUid: string;
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

function PersistentWorkerPoolsList(props: PoolsListProps) {
  let history = useHistory();
  let [openDialog, setOpenDialog] = useState(false);

  let deletePool = poolId => {
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
  return (
    <Card>
      <CardHeader title="Persistent Worker Pools" />
      <CardContent>
        <List>
          {props.pools.map(
            pool =>
              pool && (
                <ListItem key={pool.id} button onClick={() => navigate(history, '', '/pool/' + pool.id)}>
                  <ListItemAvatar>
                    <Avatar>
                      <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={pool.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deletePool(pool.id)}>
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
          ownerUid={props.ownerUid}
          open={openDialog}
          onClose={() => setOpenDialog(!openDialog)}
        />
        <Button variant="contained" onClick={() => setOpenDialog(!openDialog)}>
          Create New
        </Button>
      </CardActions>
    </Card>
  );
}

interface DialogProps {
  ownerUid: string;
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

function CreateNewPersistentWorkerPoolDialog(props: DialogProps) {
  let history = useHistory();
  let [name, setName] = useState('');
  let [enabledForPublic, setEnabledForPublic] = useState(true);

  function createPool() {
    const input: CreatePersistentWorkerPoolInput = {
      clientMutationId: 'create-persistent-worker-pool-' + props.ownerUid,
      ownerUid: props.ownerUid,
      name: name,
      enabledForPublic: enabledForPublic,
    };
    commitMutation(environment, {
      mutation: createPoolMutation,
      variables: { input: input },
      onCompleted: (response: PersistentWorkerPoolsListCreateMutationResponse) => {
        navigate(history, '', '/pool/' + response.createPersistentWorkerPool.pool.id);
        props.onClose();
      },
      onError: err => console.log(err),
    });
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Create Persistent Worker Pool</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch checked={enabledForPublic} onChange={event => setEnabledForPublic(event.target.checked)} />
            }
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
          <Input id="name" onChange={event => setName(event.target.value)} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={createPool} disabled={name === ''} variant="contained">
          Create
        </Button>
        <Button onClick={props.onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateNewPersistentWorkerPoolDialog.contextTypes = {
  router: PropTypes.object,
};

export default PersistentWorkerPoolsList;
