import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core';
import { notificationColor } from '../../utils/colors';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { navigate } from '../../utils/navigate';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Notification_notification } from './__generated__/Notification_notification.graphql';

let styles = {
  notification: {
    padding: 8,
  },
};

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  notification: Notification_notification;
}

class Notification extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  render() {
    let { notification, classes } = this.props;
    let headerStyle = {
      backgroundColor: notificationColor(notification.level),
    };
    let linkComponent = !notification.link ? null : (
      <IconButton onClick={e => navigate(this.context.router, e, notification.link)}>
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
}

export default createFragmentContainer(withStyles(styles)(withRouter(Notification)), {
  notification: graphql`
    fragment Notification_notification on Notification {
      level
      message
      link
    }
  `,
});
