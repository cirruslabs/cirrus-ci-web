import React, { useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { commitMutation } from 'react-relay';
import environment from '../../createRelayEnvironment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import DialogActions from '@mui/material/DialogActions';
import { graphql } from 'babel-plugin-relay/macro';
import {
  CreatePersistentWorkerPoolInput,
  PersistentWorkerPoolsListCreateMutationResponse,
} from './__generated__/PersistentWorkerPoolsListCreateMutation.graphql';
import { navigateHelper } from '../../utils/navigateHelper';
import PropTypes from 'prop-types';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { PersistentWorkerPoolsListDeleteMutationVariables } from './__generated__/PersistentWorkerPoolsListDeleteMutation.graphql';
import PoolVisibilityIcon from '../icons/PoolVisibilityIcon';
import { useNavigate } from 'react-router-dom';

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
  let navigate = useNavigate();
  let [openDialog, setOpenDialog] = useState(false);

  let deletePool = poolId => {
    const variables: PersistentWorkerPoolsListDeleteMutationVariables = {
      input: {
        clientMutationId: 'delete-persistent-worker-pool-' + poolId,
        poolId: poolId,
      },
    };
    commitMutation(environment, {
      mutation: deletePoolMutation,
      variables: variables,
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
    <Card elevation={24}>
      <CardHeader title="Persistent Worker Pools" />
      <CardContent>
        <List>
          {props.pools.map(
            pool =>
              pool && (
                <ListItem key={pool.id} button onClick={() => navigateHelper(navigate, '', '/pool/' + pool.id)}>
                  <ListItemAvatar>
                    <Avatar>
                      <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={pool.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deletePool(pool.id)} size="large">
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
  let navigate = useNavigate();
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
      onCompleted: (response: PersistentWorkerPoolsListCreateMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        navigateHelper(navigate, '', '/pool/' + response.createPersistentWorkerPool.pool.id);
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
