import React, { useState } from 'react';
import { useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import PoolVisibilityIcon from 'components/icons/PoolVisibilityIcon';
import { navigateHelper } from 'utils/navigateHelper';

import {
  CreatePersistentWorkerPoolInput,
  PersistentWorkerPoolsListCreateMutation,
  PersistentWorkerPoolsListCreateMutation$data,
} from './__generated__/PersistentWorkerPoolsListCreateMutation.graphql';
import {
  PersistentWorkerPoolsListDeleteMutation,
  PersistentWorkerPoolsListDeleteMutation$variables,
} from './__generated__/PersistentWorkerPoolsListDeleteMutation.graphql';

interface PoolsListProps {
  readonly ownerUid: string;
  readonly platform: string;
  pools: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly enabledForPublic: boolean;
  }>;
}

function PersistentWorkerPoolsList(props: PoolsListProps) {
  let navigate = useNavigate();
  let [openDialog, setOpenDialog] = useState(false);

  const [commitDeleteMutation] = useMutation<PersistentWorkerPoolsListDeleteMutation>(graphql`
    mutation PersistentWorkerPoolsListDeleteMutation($input: DeletePersistentWorkerPoolInput!) {
      deletePersistentWorkerPool(input: $input) {
        deletedPoolId @deleteRecord
      }
    }
  `);
  let deletePool = poolId => {
    const variables: PersistentWorkerPoolsListDeleteMutation$variables = {
      input: {
        clientMutationId: 'delete-persistent-worker-pool-' + poolId,
        poolId: poolId,
      },
    };
    commitDeleteMutation({
      variables: variables,
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
                <ListItem key={pool.id} onClick={() => navigateHelper(navigate, '', '/pool/' + pool.id)}>
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
          platform={props.platform}
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
  platform: string;

  onClose(...args: any[]): void;
}

function CreateNewPersistentWorkerPoolDialog(props: DialogProps) {
  let navigate = useNavigate();
  let [name, setName] = useState('');
  let [enabledForPublic, setEnabledForPublic] = useState(true);

  const [commitCreatePoolMutation] = useMutation<PersistentWorkerPoolsListCreateMutation>(graphql`
    mutation PersistentWorkerPoolsListCreateMutation($input: CreatePersistentWorkerPoolInput!) {
      createPersistentWorkerPool(input: $input) {
        pool {
          id
        }
      }
    }
  `);
  function createPool() {
    const input: CreatePersistentWorkerPoolInput = {
      platform: props.platform,
      clientMutationId: 'create-persistent-worker-pool-' + props.ownerUid,
      ownerUid: props.ownerUid,
      name: name,
      enabledForPublic: enabledForPublic,
    };
    commitCreatePoolMutation({
      variables: { input: input },
      onCompleted: (response: PersistentWorkerPoolsListCreateMutation$data, errors) => {
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
