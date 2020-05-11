import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import LastDefaultBranchBuildRow from '../builds/LastDefaultBranchBuildRow';
import Tooltip from '../common/CirrusTooltip';
import { withStyles, WithStyles } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';

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
