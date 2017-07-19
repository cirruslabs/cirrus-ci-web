import React from 'react';

import {Card, CardHeader} from 'material-ui/Card';
import {notificationColor} from "../utils/colors";

class NotificationList extends React.Component {
  render() {
    let notifications = this.props.notifications;
    return (
      <div>
        {notifications.map(notification => NotificationList.notificationItem(notification))}
      </div>
    );
  }

  static notificationItem(notification) {
    let headerStyle = {
      backgroundColor: notificationColor(notification.level)
    };
    return (
      <Card key={notification.message}
            style={{borderRadius: 0}}>
        <CardHeader
          title={notification.message}
          style={headerStyle}
          actAsExpander={false}
          showExpandableButton={false}
        />
      </Card>
    );
  }
}

export default NotificationList;
