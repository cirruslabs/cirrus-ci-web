import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Tooltip from '@mui/material/Tooltip';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { navigateHelper } from '../../utils/navigateHelper';
import IconButton from '@mui/material/IconButton';
import { UserProfile_user } from './__generated__/UserProfile_user.graphql';
import { Helmet as Head } from 'react-helmet';
import Settings from '@mui/icons-material/Settings';
import OwnerPlatformIcon from '../icons/OwnerPlatformIcon';
import { Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import RunningBuild from './RunningBuild';

const styles = theme =>
  createStyles({
    title: {
      backgroundColor: theme.palette.action.disabledBackground,
    },
    gap: {
      paddingTop: 16,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
  });

interface Props extends WithStyles<typeof styles> {
  user: UserProfile_user;
}

function UserProfile(props: Props) {
  const navigate = useNavigate();

  let { user, classes } = props;

  useEffect(() => {
    // in case of only one owner (like only the user with no organizations)
    // navigate to the owner's settings immediatly
    if (user.relatedOwners.length === 1) {
      let uniqueOwner = user.relatedOwners[0];
      navigate(`/settings/${uniqueOwner.platform}/${uniqueOwner.name}`, { replace: true });
    }
  }, [navigate, user.relatedOwners]);

  let runningBuilds = <Box sx={{ padding: 2 }}>None at the moment.</Box>;

  if (user.builds && user.builds.edges.length !== 0) {
    runningBuilds = (
      <Table style={{ tableLayout: 'auto' }}>
        <TableBody>
          {user.builds.edges.map(edge => (
            <RunningBuild build={edge.node} />
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div>
      <Head>
        <title>Settings - Cirrus CI</title>
      </Head>
      <div className={classes.gap} />
      <Card elevation={24}>
        <CardHeader title="All Settings" />
        <List>
          {user.relatedOwners.map(owner => (
            <ListItem
              key={owner.platform + owner.uid}
              onClick={e => navigateHelper(navigate, e, '/github/' + owner.name)}
              secondaryAction={
                <Tooltip title="Owner settings">
                  <IconButton
                    onClick={e => navigateHelper(navigate, e, `/settings/${owner.platform}/${owner.name}`)}
                    size="large"
                  >
                    <Settings />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemAvatar>
                <OwnerPlatformIcon platform={owner.platform} />
              </ListItemAvatar>
              <ListItemText>{owner.name}</ListItemText>
            </ListItem>
          ))}
        </List>
        <CardHeader title="Currently Active Builds" />
        {runningBuilds}
      </Card>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(UserProfile), {
  user: graphql`
    fragment UserProfile_user on User {
      relatedOwners {
        platform
        name
        uid
      }
      builds(statuses: [CREATED, NEEDS_APPROVAL, TRIGGERED, EXECUTING]) {
        edges {
          node {
            ...RunningBuild_build
          }
        }
      }
    }
  `,
});
