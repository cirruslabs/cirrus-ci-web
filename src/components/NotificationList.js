import React from 'react';

import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
import {notificationColor} from "../utils/colors";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {navigate} from "../utils/navigate";
import classNames from "classnames";
import PropTypes from "prop-types";

let styles = {
  notification: {
    padding: 8,
  }
};

class NotificationList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let notifications = this.props.notifications;
    return (
      <div className="container">
        {notifications.map(notification => this.notificationItem(notification))}
      </div>
    );
  }

  notificationItem(notification) {
    let {classes} = this.props;
    let headerStyle = {
      backgroundColor: notificationColor(notification.level)
    };
    let linkComponent = !notification.link ? null :
      <IconButton onClick={(e) => navigate(this.context.router, e, notification.link)}>
        <Icon>launch</Icon>
      </IconButton>;
    return (
      <div key={notification.message}
           style={headerStyle}
           className={classNames("row", "justify-content-between", "align-items-center")}>
        <Typography
          variant="subheading"
          className={classes.notification}
        >
          {notification.message}
        </Typography>
        <div>
          {linkComponent}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(NotificationList);
