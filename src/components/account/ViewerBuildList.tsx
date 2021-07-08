import React from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import RepositoryNameChip from '../chips/RepositoryNameChip';
import BuildBranchNameChip from '../chips/BuildBranchNameChip';
import BuildStatusChip from '../chips/BuildStatusChip';
import BuildChangeChip from '../chips/BuildChangeChip';
import { navigateBuild } from '../../utils/navigate';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ViewerBuildList_viewer } from './__generated__/ViewerBuildList_viewer.graphql';
import { Helmet as Head } from 'react-helmet';

let styles = {
  chip: {
    margin: 4,
  },
  cell: {
    padding: '5px',
    width: '100%',
    maxWidth: '600px',
  },
  emptyBuilds: {
    margin: 8,
  },
  padding: {
    padding: '5px',
  },
};

interface Props extends WithStyles<typeof styles> {
  viewer: ViewerBuildList_viewer;
}

function ViewerBuildList(props: Props) {
  let { classes } = props;
  let builds = props.viewer.builds;

  let history = useHistory();

  function buildItem(build) {
    let { classes } = props;
    return (
      <TableRow
        key={build.id}
        onClick={e => navigateBuild(history, e, build.id)}
        hover={true}
        style={{ cursor: 'pointer' }}
      >
        <TableCell className={classes.padding}>
          <div className="d-flex flex-column align-items-start">
            <RepositoryNameChip repository={build.repository} fullName={true} className={classes.chip} />
            <BuildBranchNameChip build={build} className={classes.chip} />
            <BuildChangeChip build={build} className={classes.chip} />
            <BuildStatusChip build={build} className={classNames('d-lg-none', classes.chip)} />
          </div>
        </TableCell>
        <TableCell className={classes.cell}>
          <div>
            <Typography variant="body1" color="inherit">
              {build.changeMessageTitle}
            </Typography>
          </div>
        </TableCell>
        <TableCell className={classNames('d-none', 'd-lg-table-cell', classes.cell)}>
          <BuildStatusChip build={build} className={classes.chip} />
        </TableCell>
      </TableRow>
    );
  }

  let buildsComponent = (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>{builds && builds.edges.map(edge => buildItem(edge.node))}</TableBody>
    </Table>
  );
  if (!builds || builds.edges.length === 0) {
    buildsComponent = (
      <div className={classes.emptyBuilds}>
        <ReactMarkdown source="No recent builds! Please check the [documentation](https://cirrus-ci.org/) on how to start with Cirrus CI." />
      </div>
    );
  }
  return (
    <Paper elevation={1}>
      <Head>
        <title>Recent Builds - Cirrus CI</title>
      </Head>
      <Toolbar>
        <Typography variant="h6">Recent Builds</Typography>
      </Toolbar>
      {buildsComponent}
    </Paper>
  );
}

export default createFragmentContainer(withStyles(styles)(ViewerBuildList), {
  viewer: graphql`
    fragment ViewerBuildList_viewer on User {
      builds(last: 50) {
        edges {
          node {
            id
            changeMessageTitle
            durationInSeconds
            status
            ...BuildBranchNameChip_build
            ...BuildChangeChip_build
            ...BuildStatusChip_build
            repository {
              ...RepositoryNameChip_repository
            }
          }
        }
      }
    }
  `,
});
