import React from 'react';

import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
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
    let link = null;
    if (notification.message === "CI agent stopped responding!") {
      link = <span>See <a href="https://cirrus-ci.org/faq/#ci-agent-stopped-responding" target="_blank" rel="noopener noreferrer">documentation</a> for more details.</span>
    }
    return (
      <Typography
        key={notification.message}
        variant="subheading"
        style={headerStyle}
        className={classes.notification}
      >
        {notification.message} {link}
      </Typography>
    );
  }
}

export default withStyles(styles)(NotificationList);
