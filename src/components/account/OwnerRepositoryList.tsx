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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { OwnerRepositoryList_info } from './__generated__/OwnerRepositoryList_info.graphql';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import createStyles from '@mui/styles/createStyles';

let styles = theme =>
  createStyles({
    toolbar: {
      paddingLeft: 14,
      background: theme.palette.action.disabledBackground,
    },
  });

interface Props extends WithStyles<typeof styles> {
  info: OwnerRepositoryList_info;
}

let OwnerRepositoryList = (props: Props) => {
  let { classes, info } = props;

  let organizationSettings = null;

  if (info && info.viewerPermission === 'ADMIN') {
    organizationSettings = (
      <Tooltip title="Account Settings">
        <Link to={`/settings/${info.platform}/${info.name}`}>
          <IconButton size="large">
            <ManageAccountsIcon />
          </IconButton>
        </Link>
      </Tooltip>
    );
  }

  return (
    <div>
      <AppBreadcrumbs ownerName={info.name} platform={info.platform} />
      <Paper elevation={16}>
        <Toolbar className={classes.toolbar} sx={{ justifyContent: 'space-between' }} disableGutters>
          <Typography variant="h5" color="inherit">
            Repositories
          </Typography>
          {organizationSettings}
        </Toolbar>
        <Table style={{ tableLayout: 'auto' }}>
          <TableBody>
            {info.repositories.edges.map(edge => (
              <LastDefaultBranchBuildRow key={edge.node.id} repository={edge.node} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default createFragmentContainer(withStyles(styles)(OwnerRepositoryList), {
  info: graphql`
    fragment OwnerRepositoryList_info on OwnerInfo {
      platform
      uid
      name
      viewerPermission
      repositories(last: 50) {
        edges {
          node {
            id
            ...LastDefaultBranchBuildRow_repository
          }
        }
      }
    }
  `,
});
