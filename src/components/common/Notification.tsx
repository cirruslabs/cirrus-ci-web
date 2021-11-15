import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useNotificationColor } from '../../utils/colors';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { navigateHelper } from '../../utils/navigateHelper';
import classNames from 'classnames';
import { Notification_notification } from './__generated__/Notification_notification.graphql';
import { useNavigate } from 'react-router-dom';

let styles = {
  notification: {
    padding: 8,
  },
};

interface Props extends WithStyles<typeof styles> {
  notification: Notification_notification;
}

function Notification(props: Props) {
  let navigate = useNavigate();
  let { notification, classes } = props;
  let headerStyle = {
    backgroundColor: useNotificationColor(notification.level),
  };
  let linkComponent = !notification.link ? null : (
    <IconButton onClick={e => navigateHelper(navigate, e, notification.link)}>
      <Icon>launch</Icon>
    </IconButton>
  );
  return (
    <div
      key={notification.message}
      style={headerStyle}
      className={classNames('row', 'justify-content-between', 'align-items-center')}
    >
      <Typography variant="subtitle1" className={classes.notification}>
        {notification.message}
      </Typography>
      <div>{linkComponent}</div>
    </div>
  );
}

export default createFragmentContainer(withStyles(styles)(Notification), {
  notification: graphql`
    fragment Notification_notification on Notification {
      level
      message
      link
    }
  `,
});
