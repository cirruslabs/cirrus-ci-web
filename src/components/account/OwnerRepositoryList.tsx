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
import RepositoryTable from '../repositories/RepositoryTable';

let styles = theme =>
  createStyles({
    paper: {
      padding: theme.spacing(1.0, 2.5, 1.5),
      boxShadow: '0 16px 52px rgb(0 0 0 / 13%)',
      borderRadius: 4 * theme.shape.borderRadius,
    },
    header: {
      paddingLeft: 14,
      justifyContent: 'space-between',
    },
  });

interface Props extends WithStyles<typeof styles> {
  info: OwnerRepositoryList_info;
}

let OwnerRepositoryList = (props: Props) => {
  let { classes, info } = props;
  let repositories = info.repositories.edges.map(edge => edge.node);
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

  const isNewDesign = true;
  return (
    <div>
      <AppBreadcrumbs ownerName={info.name} platform={info.platform} />
      <Paper className={classes.paper}>
        <Toolbar className={classes.header} disableGutters>
          <Typography variant="h5">Repositories</Typography>
          {organizationSettings}
        </Toolbar>
        {isNewDesign ? (
          <RepositoryTable repositories={repositories} />
        ) : (
          <Table style={{ tableLayout: 'auto' }}>
            <TableBody>
              {repositories.map(repository => (
                <LastDefaultBranchBuildRow key={repository.id} repository={repository} />
              ))}
            </TableBody>
          </Table>
        )}
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
            ...RepositoryTable_repositories
          }
        }
      }
    }
  `,
});
