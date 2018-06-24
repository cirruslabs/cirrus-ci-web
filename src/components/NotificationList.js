import React from 'react';
import Notification from "./Notification";

const NotificationList = ({notifications}) => (
  <div className="container">
    {notifications.map(notification => <Notification notification={notification}/>)}
  </div>
);

export default NotificationList;
