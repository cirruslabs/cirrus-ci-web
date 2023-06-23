import React, { useEffect } from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import OwnerPlatformIcon from 'components/icons/OwnerPlatformIcon';
import { navigateHelper } from 'utils/navigateHelper';

import { UserProfile_user$key } from './__generated__/UserProfile_user.graphql';

const useStyles = mui.makeStyles(theme => {
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
      <mui.Card elevation={24}>
        <mui.CardHeader title="All Settings" />
        <mui.List>
          {user.relatedOwners &&
            user.relatedOwners.map(owner => (
              <mui.ListItem
                key={owner.platform + owner.uid}
                onClick={e => navigateHelper(navigate, e, '/github/' + owner.name)}
                secondaryAction={
                  <mui.Tooltip title="Owner settings">
                    <mui.IconButton
                      onClick={e => navigateHelper(navigate, e, `/settings/${owner.platform}/${owner.name}`)}
                      size="large"
                    >
                      <mui.icons.Settings />
                    </mui.IconButton>
                  </mui.Tooltip>
                }
              >
                <mui.ListItemAvatar>
                  <OwnerPlatformIcon platform={owner.platform} />
                </mui.ListItemAvatar>
                <mui.ListItemText>{owner.name}</mui.ListItemText>
              </mui.ListItem>
            ))}
        </mui.List>
      </mui.Card>
    </div>
  );
}
