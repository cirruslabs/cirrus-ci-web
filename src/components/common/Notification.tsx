import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';
import { useNotificationColor } from '../../utils/colors';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { navigateHelper } from '../../utils/navigateHelper';
import { Notification_notification } from './__generated__/Notification_notification.graphql';
import { useNavigate } from 'react-router-dom';
import { ListItem, ListItemText } from '@mui/material';

interface Props {
  notification: Notification_notification;
}

function Notification(props: Props) {
  let navigate = useNavigate();
  let { notification } = props;
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

export default createFragmentContainer(Notification, {
  notification: graphql`
    fragment Notification_notification on Notification {
      level
      message
      link
    }
  `,
});
