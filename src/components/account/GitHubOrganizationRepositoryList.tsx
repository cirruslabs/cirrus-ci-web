import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import LastDefaultBranchBuildRow from '../builds/LastDefaultBranchBuildRow';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Toolbar, Typography, Tooltip, IconButton, Paper, Table, TableBody } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Settings } from '@material-ui/icons';

let styles = {
  gap: {
    paddingTop: 16,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  organization: string;
  organizationInfo: any;
  repositories: any;
}

let GitHubOrganizationRepositoryList = (props: Props) => {
  let { classes, organization, organizationInfo } = props;
  let repositories = props.repositories || [];

  let organizationSettings = null;

  if (organizationInfo && organizationInfo.role === 'admin') {
    organizationSettings = (
      <Tooltip title="Organization Settings">
        <Link to={'/settings/github/' + organization}>
          <IconButton>
            <Settings />
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
            {props.organization}'s Repositories
          </Typography>
          {organizationSettings}
        </Toolbar>
      </Paper>
      <div className={classes.gap} />
      <Paper elevation={1}>
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {repositories && repositories.map(repo => <LastDefaultBranchBuildRow key={repo.__id} repository={repo} />)}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(withRouter(GitHubOrganizationRepositoryList));
