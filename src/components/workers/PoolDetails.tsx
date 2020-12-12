import {createStyles, withStyles, WithStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {graphql} from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer} from 'react-relay';
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  pool: PoolDetails_pool;
}

class PoolDetails extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
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
                  <IconButton aria-label="edit">
                    <EditIcon/>
                  </IconButton>
                </Tooltip>
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
