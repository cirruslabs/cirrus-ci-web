import React from 'react';
import { withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import Button from '@material-ui/core/Button';
import BillingSettingsDialog from './BillingSettingsDialog';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1.0),
  },
});

class BillingSettingsButton extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  state = { openDialog: false };

  toggleDialog = () => {
    this.setState(prevState => ({
      ...prevState,
      openDialog: !prevState.openDialog,
    }));
  };

  render() {
    let { billingSettings, classes, className } = this.props;

    return (
      <div className={className}>
        <Button variant="contained" onClick={this.toggleDialog}>
          {billingSettings.enabled ? (
            <AlarmOnIcon className={classes.leftIcon} />
          ) : (
            <AlarmOffIcon className={classes.leftIcon} />
          )}
          {billingSettings.enabled ? 'Edit Auto Pay' : 'Set up Auto Pay'}
        </Button>
        <BillingSettingsDialog
          billingSettings={billingSettings}
          open={this.state.openDialog}
          onClose={this.toggleDialog}
        />
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(BillingSettingsButton)), {
  info: graphql`
    fragment BillingSettingsButton_info on GitHubOrganizationInfo {
      billingSettings {
        enabled
        ...BillingSettingsDialog_billingSettings
      }
    }
  `,
});
