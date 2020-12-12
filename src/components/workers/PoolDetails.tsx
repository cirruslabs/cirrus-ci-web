import {createStyles, withStyles, WithStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {graphql} from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import {commitMutation, createFragmentContainer} from 'react-relay';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Helmet as Head} from 'react-helmet';
import {PoolDetails_pool} from "./__generated__/PoolDetails_pool.graphql";
import {
  Avatar,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import KeyIcon from "@material-ui/icons/VpnKey";
import PoolVisibilityIcon from "../icons/PoolVisibilityIcon";
import CardActions from "@material-ui/core/CardActions";
import {
  CreatePersistentWorkerPoolInput,
  PersistentWorkerPoolsListCreateMutationResponse
} from "./__generated__/PersistentWorkerPoolsListCreateMutation.graphql";
import environment from "../../createRelayEnvironment";
import {navigate} from "../../utils/navigate";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {UpdatePersistentWorkerPoolInput} from "./__generated__/PoolDetailsUpdateMutation.graphql";


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
  });

interface PoolDetailsProps extends WithStyles<typeof styles>, RouteComponentProps {
  pool: PoolDetails_pool;
}

interface PoolDetailsState {
  openEditDialog: boolean;
}

class PoolDetails extends React.Component<PoolDetailsProps, PoolDetailsState> {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = {openEditDialog: false};

  toggleEditDialog = () => {
    this.setState(prevState => ({
      ...prevState,
      openEditDialog: !prevState.openEditDialog,
    }));
  };

  render() {
    let {pool, classes} = this.props;

    return (
      <div>
        <Head>
          <title>{pool.name} pool</title>
        </Head>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                <PoolVisibilityIcon enabledForPublic={pool.enabledForPublic}/>
              </Avatar>
            }
            action={
              <div>
                <Tooltip title="Show Registration Token">
                  <IconButton aria-label="show-token">
                    <KeyIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={this.toggleEditDialog}>
                    <EditIcon/>
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
            <Table aria-label="workers table">
              <TableHead>
                <TableRow>
                  <TableCell/>
                  <TableCell>Version</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>host</TableCell>
                  <TableCell>Labels</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pool.workers.map((worker) => (
                  worker && <TableRow key={worker.name}>
                    <TableCell>{worker.os}/{worker.arch}</TableCell>
                    <TableCell>{worker.version}</TableCell>
                    <TableCell component="th">{worker.name}</TableCell>
                    <TableCell>{worker.hostname}</TableCell>
                    <TableCell>{worker.labels}</TableCell>
                  </TableRow>
                ))}
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
      enabledForPublic: this.state.enabledForPublic
    };
    commitMutation(environment, {
      mutation: updatePoolMutation,
      variables: {input: input},
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
              control={<Switch checked={this.state.enabledForPublic} onChange={this.checkField('enabledForPublic')}
                               color="primary"/>}
              label="Enabled for public"
            />
          </FormControl>
          <Typography variant="subtitle1">
            <p>
              Enabling worker pool for public will allow any public repository of the organization to schedule tasks on
              this pool.
              Please use with caution and think of security risks involved in this decision!
            </p>
          </Typography>
          <FormControl fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              id="name"
              onChange={this.changeField('name')}
              value={this.state.name}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.createPool} color="primary" variant="contained"
                  disabled={this.state.name === this.props.name && this.state.enabledForPublic === this.props.enabledForPublic}>
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


export default createFragmentContainer(withStyles(styles)(withRouter(PoolDetails)), {
  pool: graphql`
    fragment PoolDetails_pool on PersistentWorkerPool {
      id
      name
      enabledForPublic
      workers {
        name
        os
        arch
        hostname
        version
        labels
      }
    }
  `,
});
