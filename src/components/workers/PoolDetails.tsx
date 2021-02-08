import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import { commitMutation, createRefetchContainer, RelayRefetchProp } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Helmet as Head } from 'react-helmet';
import { PoolDetails_pool } from './__generated__/PoolDetails_pool.graphql';
import {
  Avatar,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PoolVisibilityIcon from '../icons/PoolVisibilityIcon';
import environment from '../../createRelayEnvironment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { UpdatePersistentWorkerPoolInput } from './__generated__/PoolDetailsUpdateMutation.graphql';
import {
  GetPersistentWorkerPoolRegistrationTokenInput,
  PoolDetailsGetRegistrationTokenMutationResponse,
} from './__generated__/PoolDetailsGetRegistrationTokenMutation.graphql';
import CopyPasteField from '../common/CopyPasteField';
import WorkerStatusChip from './WorkerStatusChip';
import TaskStatusChipExtended from '../chips/TaskStatusChipExtended';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import { DeletePersistentWorkerInput } from './__generated__/PoolDetailsDeleteWorkerMutation.graphql';
import { UpdatePersistentWorkerInput } from './__generated__/PoolDetailsUpdateWorkerMutation.graphql';

const styles = theme =>
  createStyles({
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
  });

interface PoolDetailsProps extends WithStyles<typeof styles>, RouteComponentProps {
  pool: PoolDetails_pool;
  relay: RelayRefetchProp;
}

interface PoolDetailsState {
  openEditDialog: boolean;
  registrationToken?: string;
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

class PoolDetails extends React.Component<PoolDetailsProps, PoolDetailsState> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = { openEditDialog: false, registrationToken: null };

  private refreshInterval: NodeJS.Timer;

  componentDidMount() {
    this.refreshInterval = setInterval(() => this._refetch(), 10_000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  _refetch = () => {
    this.props.relay.refetch({ poolId: this.props.pool.id }, { force: true });
  };

  toggleEditDialog = () => {
    this.setState(prevState => ({
      ...prevState,
      openEditDialog: !prevState.openEditDialog,
    }));
  };

  retrieveRegistrationToken = () => {
    const input: GetPersistentWorkerPoolRegistrationTokenInput = {
      clientMutationId: 'get-worker-pool-token-' + this.props.pool.id,
      poolId: this.props.pool.id,
    };
    commitMutation(environment, {
      mutation: getRegistrationTokenMutation,
      variables: { input: input },
      onCompleted: (response: PoolDetailsGetRegistrationTokenMutationResponse) => {
        this.setState(prevState => ({
          ...prevState,
          registrationToken: response.persistentWorkerPoolRegistrationToken.token,
        }));
      },
      onError: err => console.log(err),
    });
  };

  deleteWorker = workerName => {
    let poolId = this.props.pool.id;
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
          this._refetch();
        }
      },
      onError: err => console.log(err),
    });
  };

  updateWorker = (workerName, disabled) => {
    let poolId = this.props.pool.id;
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
          this._refetch();
        }
      },
      onError: err => console.log(err),
    });
  };

  render() {
    let { pool, classes } = this.props;

    let viewerCanSeeToken = pool.viewerPermission === 'ADMIN' || pool.viewerPermission === 'WRITE';
    return (
      <div>
        <Head>
          <title>{pool.name} pool</title>
        </Head>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic} />
              </Avatar>
            }
            action={
              <div>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={this.toggleEditDialog}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <EditPersistentWorkerPoolDialog
                  poolId={this.props.pool.id}
                  name={this.props.pool.name}
                  enabledForPublic={this.props.pool.enabledForPublic}
                  open={this.state.openEditDialog}
                  onClose={this.toggleEditDialog}
                />
              </div>
            }
            title={`Pool ${pool.name}`}
            subheader={`Workers count: ${pool.workers.length}`}
          />
          <CardContent>
            <Typography>
              In order to add a persistent worker to the pool please install{' '}
              <a href="https://github.com/cirruslabs/cirrus-cli/blob/master/PERSISTENT-WORKERS.md">Cirrus CLI</a> on a
              machine that will become a persistent worker.
            </Typography>
          </CardContent>
          {viewerCanSeeToken && this.state.registrationToken && (
            <CardContent>
              <InputLabel htmlFor="registration-token">Registration Token</InputLabel>
              <CopyPasteField id="registration-token" value={this.state.registrationToken} fullWidth={true} />
            </CardContent>
          )}
          <CardActions className="d-flex flex-wrap justify-content-end">
            {viewerCanSeeToken && !this.state.registrationToken && (
              <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={this.retrieveRegistrationToken}>
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
                            <IconButton edge="start" onClick={() => this.updateWorker(worker.name, !worker.disabled)}>
                              {worker.disabled ? (
                                <PlayCircleOutlineIcon className={classes.enabledWorkerButton} />
                              ) : (
                                <PauseCircleOutlineIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <IconButton edge="end" aria-label="delete" onClick={() => this.deleteWorker(worker.name)}>
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
      </div>
    );
  }
}

interface DialogProps {
  poolId: string;
  name: string;
  enabledForPublic: boolean;

  open: boolean;

  onClose(...args: any[]): void;
}

interface DialogState {
  name: string;
  enabledForPublic: boolean;
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

class EditPersistentWorkerPoolDialog extends React.Component<DialogProps, DialogState> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props: DialogProps) {
    super(props);
    this.state = {
      name: this.props.name,
      enabledForPublic: this.props.enabledForPublic,
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
    const input: UpdatePersistentWorkerPoolInput = {
      clientMutationId: 'edit-persistent-worker-pool-' + this.props.poolId,
      poolId: this.props.poolId,
      name: this.state.name,
      enabledForPublic: this.state.enabledForPublic,
    };
    commitMutation(environment, {
      mutation: updatePoolMutation,
      variables: { input: input },
      onCompleted: this.props.onClose,
      onError: err => console.log(err),
    });
  };

  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle>Edit Persistent Worker Pool</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.enabledForPublic}
                  onChange={this.checkField('enabledForPublic')}
                  color="primary"
                />
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
            <Input id="name" onChange={this.changeField('name')} value={this.state.name} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.createPool}
            color="primary"
            variant="contained"
            disabled={
              this.state.name === this.props.name && this.state.enabledForPublic === this.props.enabledForPublic
            }
          >
            Update
          </Button>
          <Button onClick={this.props.onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default createRefetchContainer(
  withStyles(styles)(withRouter(PoolDetails)),
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
