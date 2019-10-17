import PropTypes from 'prop-types';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import LastDefaultBranchBuildRow from './LastDefaultBranchBuildRow';
import { Tooltip, withStyles, WithStyles } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

let styles = {
  gap: {
    paddingTop: 16,
  },
  chip: {
    margin: 4,
  },
  cell: {
    padding: 0,
    width: '100%',
    maxWidth: '600px',
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  organization;
  organizationInfo;
  repositories;
}

class GitHubOrganizationRepositoryList extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { classes, organization, organizationInfo } = this.props;
    let repositories = this.props.repositories || [];

    let organizationSettings = null;

    if (organizationInfo && organizationInfo.role === 'admin') {
      organizationSettings = (
        <Tooltip title="Organization Settings">
          <Link to={'/settings/github/' + organization}>
            <IconButton>
              <Icon>settings</Icon>
            </IconButton>
          </Link>
        </Tooltip>
      );
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className="justify-content-between">
            <Typography variant="h6" color="inherit">
              Repositories of {this.props.organization} organization
            </Typography>
            {organizationSettings}
          </Toolbar>
        </Paper>
        <div className={classes.gap} />
        <Paper elevation={1}>
          <Table style={{ tableLayout: 'auto' }}>
            <TableBody>
              {repositories &&
                repositories.map(repo => <LastDefaultBranchBuildRow key={repo.__id} repository={repo} />)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(GitHubOrganizationRepositoryList));
