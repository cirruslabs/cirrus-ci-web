import React from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router-dom';

import { graphql } from 'babel-plugin-relay/macro';

import { ListItem, ListItemText } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

import { useNotificationColor } from 'utils/colors';
import { navigateHelper } from 'utils/navigateHelper';

import { Notification_notification$key } from './__generated__/Notification_notification.graphql';

interface Props {
  notification: Notification_notification$key;
}

export default function Notification(props: Props) {
  let notification = useFragment(
    graphql`
      fragment Notification_notification on Notification {
        level
        message
        link
      }
    `,
    props.notification,
  );

  let navigate = useNavigate();
  return (
    <ListItem
      key={notification.message}
      sx={{ bgcolor: useNotificationColor(notification.level) }}
      secondaryAction={
        !notification.link ? null : (
          <IconButton edge="end" onClick={e => navigateHelper(navigate, e, notification.link)}>
            <Icon>launch</Icon>
          </IconButton>
        )
      }
    >
      <ListItemText primary={notification.message} />
    </ListItem>
  );
}
