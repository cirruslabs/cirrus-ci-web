import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFragment } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { navigateHelper } from '../../utils/navigateHelper';
import IconButton from '@mui/material/IconButton';
import { UserProfile_user$key } from './__generated__/UserProfile_user.graphql';
import Settings from '@mui/icons-material/Settings';
import OwnerPlatformIcon from '../icons/OwnerPlatformIcon';
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

const useStyles = makeStyles(theme => {
  return {
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
  };
});

interface Props {
  user: UserProfile_user$key;
}

export default function UserProfile(props: Props) {
  let user = useFragment(
    graphql`
      fragment UserProfile_user on User {
        relatedOwners {
          platform
          name
          uid
        }
      }
    `,
    props.user,
  );

  const navigate = useNavigate();

  let classes = useStyles();

  useEffect(() => {
    // in case of only one owner (like only the user with no organizations)
    // navigate to the owner's settings immediatly
    if (user.relatedOwners && user.relatedOwners.length === 1) {
      let uniqueOwner = user.relatedOwners[0];
      navigate(`/settings/${uniqueOwner.platform}/${uniqueOwner.name}`, { replace: true });
    }
  }, [navigate, user.relatedOwners]);

  useEffect(() => {
    document.title = 'Settings - Cirrus CI';
  }, []);

  return (
    <div>
      <div className={classes.gap} />
      <Card elevation={24}>
        <CardHeader title="All Settings" />
        <List>
          {user.relatedOwners &&
            user.relatedOwners.map(owner => (
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
      </Card>
    </div>
  );
}
