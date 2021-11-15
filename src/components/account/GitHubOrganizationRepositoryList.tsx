import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import LastDefaultBranchBuildRow from '../builds/LastDefaultBranchBuildRow';
import { WithStyles } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';

let styles = {
  gap: {
    paddingTop: 16,
  },
};

interface Props extends WithStyles<typeof styles> {
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
          <IconButton size="large">
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

export default withStyles(styles)(GitHubOrganizationRepositoryList);
