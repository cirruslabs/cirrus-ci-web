import React from 'react';

import {Typography, withStyles} from 'material-ui';
import {notificationColor} from "../utils/colors";

let styles = {
  notification: {
    padding: 8,
  }
};

class NotificationList extends React.Component {
  render() {
    let notifications = this.props.notifications;
    return (
      <div>
        {notifications.map(notification => this.notificationItem(notification))}
      </div>
    );
  }

  notificationItem(notification) {
    let {classes} = this.props;
    let headerStyle = {
      backgroundColor: notificationColor(notification.level)
    };
    return (
      <Typography
        key={notification.message}
        variant="subheading"
        style={headerStyle}
        className={classes.notification}
      >
        {notification.message}
      </Typography>
    );
  }
}

export default withStyles(styles)(NotificationList);
