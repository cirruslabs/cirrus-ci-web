import {makeStyles} from '@mui/styles';
import Card from '@mui/material/Card';
import {graphql} from 'babel-plugin-relay/macro';
import React, {useEffect, useState} from 'react';
import {commitMutation, createRefetchContainer, RelayRefetchProp} from 'react-relay';
import {Helmet as Head} from 'react-helmet';
import {PoolDetails_pool} from './__generated__/PoolDetails_pool.graphql';
import {
  Avatar,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PoolVisibilityIcon from '../icons/PoolVisibilityIcon';
import environment from '../../createRelayEnvironment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {UpdatePersistentWorkerPoolInput} from './__generated__/PoolDetailsUpdateMutation.graphql';
import {
  GetPersistentWorkerPoolRegistrationTokenInput,
  PoolDetailsGetRegistrationTokenMutationResponse,
} from './__generated__/PoolDetailsGetRegistrationTokenMutation.graphql';
import CopyPasteField from '../common/CopyPasteField';
import WorkerStatusChip from './WorkerStatusChip';
import TaskStatusChipExtended from '../chips/TaskStatusChipExtended';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import {DeletePersistentWorkerInput} from './__generated__/PoolDetailsDeleteWorkerMutation.graphql';
import {UpdatePersistentWorkerInput} from './__generated__/PoolDetailsUpdateWorkerMutation.graphql';

const useStyles = makeStyles(theme => {
  return {
    gap: {
      paddingTop: 16,
    },
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginRight: 4,
    },
    wrapper: {
      paddingLeft: 0,
      display: 'flex',
      flexWrap: 'wrap',
    },
    enabledWorkerButton: {
      color: theme.palette.warning.main,
    },
  };
});

interface PoolDetailsProps {
  pool: PoolDetails_pool;
  relay: RelayRefetchProp;
}

const getRegistrationTokenMutation = graphql`
  mutation PoolDetailsGetRegistrationTokenMutation($input: GetPersistentWorkerPoolRegistrationTokenInput!) {
    persistentWorkerPoolRegistrationToken(input: $input) {
      token
    }
  }
`;

const deleteWorkerMutation = graphql`
  mutation PoolDetailsDeleteWorkerMutation($input: DeletePersistentWorkerInput!) {
    deletePersistentWorker(input: $input) {
      clientMutationId
    }
  }
`;

const updateWorkerMutation = graphql`
  mutation PoolDetailsUpdateWorkerMutation($input: UpdatePersistentWorkerInput!) {
    updatePersistentWorker(input: $input) {
      clientMutationId
      worker {
        name
        disabled
      }
    }
  }
`;

function PoolDetails(props: PoolDetailsProps) {
  let [openEditDialog, setOpenEditDialog] = useState(false);
  let [registrationToken, setRegistrationToken] = useState(null);
  let { pool } = props;
  let classes = useStyles();

  function refetchData() {
    props.relay.refetch({ poolId: props.pool.id }, { force: true });
  }

  useEffect(() => {
    const timeoutId = setInterval(() => {
      refetchData();
    }, 10_000);
    return () => clearInterval(timeoutId);
  });

  function retrieveRegistrationToken() {
    const input: GetPersistentWorkerPoolRegistrationTokenInput = {
      clientMutationId: 'get-worker-pool-token-' + props.pool.id,
      poolId: props.pool.id,
    };
    commitMutation(environment, {
      mutation: getRegistrationTokenMutation,
      variables: { input: input },
      onCompleted: (response: PoolDetailsGetRegistrationTokenMutationResponse, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setRegistrationToken(response.persistentWorkerPoolRegistrationToken.token);
      },
      onError: err => console.log(err),
    });
  }

  function deleteWorker(workerName) {
    let poolId = props.pool.id;
    const input: DeletePersistentWorkerInput = {
      clientMutationId: `delete-persistent-worker-${poolId}-${workerName}`,
      poolId: poolId,
      name: workerName,
    };
    commitMutation(environment, {
      mutation: deleteWorkerMutation,
      variables: { input: input },
      onCompleted: (response, errors) => {
        if (errors) {
          console.log(errors);
        } else {
          refetchData();
        }
      },
      onError: err => console.log(err),
    });
  }

  function updateWorker(workerName, disabled) {
    let poolId = props.pool.id;
    const input: UpdatePersistentWorkerInput = {
      clientMutationId: `update-persistent-worker-${poolId}-${workerName}`,
      poolId: poolId,
      name: workerName,
      disabled: disabled,
    };
    commitMutation(environment, {
      mutation: updateWorkerMutation,
      variables: { input: input },
      onCompleted: (response, errors) => {
        if (errors) {
          console.log(errors);
        } else {
          refetchData();
        }
      },
      onError: err => console.log(err),
    });
  }

  let viewerCanSeeToken = pool.viewerPermission === 'ADMIN' || pool.viewerPermission === 'WRITE';
  return (
    <>
      <Head>
        <title>{pool.name} pool</title>
      </Head>
      <Card elevation={24}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic} />
            </Avatar>
          }
          action={
            <div>
              <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={() => setOpenEditDialog(!openEditDialog)} size="large">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <EditPersistentWorkerPoolDialog
                poolId={props.pool.id}
                name={props.pool.name}
                enabledForPublic={props.pool.enabledForPublic}
                open={openEditDialog}
                onClose={() => setOpenEditDialog(!openEditDialog)}
              />
            </div>
          }
          title={`Pool ${pool.name}`}
          subheader={`Workers count: ${pool.workers.length}`}
        />
        <CardContent>
          <Typography>
            In order to add a persistent worker to the pool please install{' '}
            <Link color="inherit" href="https://github.com/cirruslabs/cirrus-cli/blob/master/PERSISTENT-WORKERS.md">
              Cirrus CLI
            </Link>{' '}
            on a machine that will become a persistent worker.
          </Typography>
        </CardContent>
        {viewerCanSeeToken && registrationToken && (
          <CardContent>
            <InputLabel htmlFor="registration-token">Registration Token</InputLabel>
            <CopyPasteField id="registration-token" value={registrationToken} fullWidth={true} />
          </CardContent>
        )}
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {viewerCanSeeToken && !registrationToken && (
            <Button variant="contained" startIcon={<VisibilityIcon />} onClick={retrieveRegistrationToken}>
              Show Registration Token
            </Button>
          )}
        </CardActions>
        <CardContent>
          <Table aria-label="workers table">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>host</TableCell>
                <TableCell>Labels</TableCell>
                <TableCell>Running Tasks</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pool.workers.map(
                worker =>
                  worker && (
                    <TableRow key={worker.name}>
                      <TableCell>
                        <WorkerStatusChip worker={worker} />
                      </TableCell>
                      <TableCell>{worker.version}</TableCell>
                      <TableCell component="th">{worker.name}</TableCell>
                      <TableCell>{worker.hostname}</TableCell>
                      <TableCell>
                        <div className={classes.wrapper}>
                          {worker.labels.map(label => (
                            <Chip key={label} className={classes.chip} label={label} />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!worker.info
                          ? null
                          : worker.info.runningTasks.map(task => <TaskStatusChipExtended task={task} />)}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={worker.disabled ? 'Enable task scheduling' : 'Disable task scheduling'}>
                          <IconButton
                            edge="start"
                            onClick={() => updateWorker(worker.name, !worker.disabled)}
                            size="large"
                          >
                            {worker.disabled ? (
                              <PlayCircleOutlineIcon className={classes.enabledWorkerButton} />
                            ) : (
                              <PauseCircleOutlineIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteWorker(worker.name)}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

interface DialogProps {
  poolId: string;
  name: string;
  enabledForPublic: boolean;

  open: boolean;

  onClose(...args: any[]): void;
}

const updatePoolMutation = graphql`
  mutation PoolDetailsUpdateMutation($input: UpdatePersistentWorkerPoolInput!) {
    updatePersistentWorkerPool(input: $input) {
      pool {
        id
        name
        enabledForPublic
      }
    }
  }
`;

function EditPersistentWorkerPoolDialog(props: DialogProps) {
  let [name, setName] = useState(props.name);
  let [enabledForPublic, setEnabledForPublic] = useState(props.enabledForPublic);

  function createPool() {
    const input: UpdatePersistentWorkerPoolInput = {
      clientMutationId: 'edit-persistent-worker-pool-' + props.poolId,
      poolId: props.poolId,
      name: name,
      enabledForPublic: enabledForPublic,
    };
    commitMutation(environment, {
      mutation: updatePoolMutation,
      variables: { input: input },
      onCompleted: props.onClose,
      onError: err => console.log(err),
    });
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle>Edit Persistent Worker Pool</DialogTitle>
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
          <Input id="name" onChange={event => setName(event.target.value)} value={name} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={createPool}
          variant="contained"
          disabled={name === props.name && enabledForPublic === props.enabledForPublic}
        >
          Update
        </Button>
        <Button onClick={props.onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default createRefetchContainer(
  PoolDetails,
  {
    pool: graphql`
      fragment PoolDetails_pool on PersistentWorkerPool {
        id
        name
        enabledForPublic
        viewerPermission
        workers {
          name
          disabled
          hostname
          version
          labels
          ...WorkerStatusChip_worker
          info {
            runningTasks {
              ...TaskStatusChipExtended_task
            }
          }
        }
      }
    `,
  },
  graphql`
    query PoolDetailsRefetchQuery($poolId: ID!) {
      persistentWorkerPool(poolId: $poolId) {
        ...PoolDetails_pool
      }
    }
  `,
);
