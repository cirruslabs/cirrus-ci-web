import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import LastDefaultBranchBuildRow from "./LastDefaultBranchBuildRow";
import {withStyles} from "@material-ui/core/index.es";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "react-router-dom/Link";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Icon from "@material-ui/core/Icon/Icon";

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

class GitHubOrganizationRepositoryList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {classes, organization, organizationInfo} = this.props;
    let repositories = this.props.repositories || [];

    let organizationSettings = null;

    if (organizationInfo.role === 'admin') {
      organizationSettings = (
        <Link to={"/settings/github/" + organization}>
          <IconButton tooltip="Organization Settings">
            <Icon>settings</Icon>
          </IconButton>
        </Link>
      );
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className="justify-content-between">
            <Typography variant="title" color="inherit">
              Repositories of {this.props.organization} organization
            </Typography>
            {organizationSettings}
          </Toolbar>
        </Paper>
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

export default withRouter(withStyles(styles)(GitHubOrganizationRepositoryList));
