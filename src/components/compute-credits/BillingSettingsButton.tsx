import React, { useState } from 'react';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import Button from '@mui/material/Button';
import BillingSettingsDialog from './BillingSettingsDialog';
import { BillingSettingsButton_info } from './__generated__/BillingSettingsButton_info.graphql';

interface Props {
  info: BillingSettingsButton_info;
  className?: string;
}

function BillingSettingsButton(props: Props) {
  let [openDialog, setOpenDialog] = useState(false);
  let { info, className } = props;
  if (!info) return null;

  let { billingSettings } = info;
  if (!billingSettings) return null;

  return (
    <div className={className}>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(!openDialog)}
        startIcon={billingSettings.enabled ? <AlarmOnIcon /> : <AlarmOffIcon />}
      >
        {billingSettings.enabled ? 'Edit Auto Pay' : 'Set up Auto Pay'}
      </Button>
      <BillingSettingsDialog
        billingSettings={billingSettings}
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
      />
    </div>
  );
}

export default createFragmentContainer(BillingSettingsButton, {
  info: graphql`
    fragment BillingSettingsButton_info on OwnerInfo {
      billingSettings {
        enabled
        ...BillingSettingsDialog_billingSettings
      }
    }
  `,
});
