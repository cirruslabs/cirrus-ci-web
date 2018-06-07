import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import LastDefaultBranchBuildRow from "./LastDefaultBranchBuildRow";
import {withStyles} from "@material-ui/core/index.es";

let styles = {
  gap: {
    paddingTop: 16
  },
  chip: {
    margin: 4,
  },
  cell: {
    padding: 0,
    width: "100%",
    maxWidth: "600",
  },
};

class RepositoryList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {classes} = this.props;
    let repositories = this.props.repositories || [];

    console.log(repositories);

    return (
      <div>
        <div className={classes.gap}/>
        <Paper elevation={1}>
          <Table style={{tableLayout: 'auto'}}>
            <TableBody>
              {repositories && repositories.map(repo => <LastDefaultBranchBuildRow key={repo.__id} repository={repo}/>)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(RepositoryList));
