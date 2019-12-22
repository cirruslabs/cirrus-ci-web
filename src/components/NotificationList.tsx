import React from 'react';
import Notification from './Notification';

export default ({ notifications }) => (
  <div className="container">
    {notifications.map(notification => (
      <Notification notification={notification} />
    ))}
  </div>
);
