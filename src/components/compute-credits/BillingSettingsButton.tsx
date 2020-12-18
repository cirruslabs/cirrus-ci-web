import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import Button from '@material-ui/core/Button';
import BillingSettingsDialog from './BillingSettingsDialog';
import { BillingSettingsButton_info } from './__generated__/BillingSettingsButton_info.graphql';

interface State {
  openDialog: boolean;
}

interface Props extends RouteComponentProps {
  info: BillingSettingsButton_info;
  className?: string;
}

class BillingSettingsButton extends React.Component<Props, State> {
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
    let { info, className } = this.props;
    if (!info) return null;

    let { billingSettings } = info;
    if (!billingSettings) return null;

    return (
      <div className={className}>
        <Button
          variant="contained"
          onClick={this.toggleDialog}
          startIcon={billingSettings.enabled ? <AlarmOnIcon /> : <AlarmOffIcon />}
        >
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

export default createFragmentContainer(withRouter(BillingSettingsButton), {
  info: graphql`
    fragment BillingSettingsButton_info on GitHubOrganizationInfo {
      billingSettings {
        enabled
        ...BillingSettingsDialog_billingSettings
      }
    }
  `,
});
