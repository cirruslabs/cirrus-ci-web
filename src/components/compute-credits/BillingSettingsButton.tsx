import React, { useState } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import Button from '@mui/material/Button';

import BillingSettingsDialog from './BillingSettingsDialog';
import { BillingSettingsButton_info$key } from './__generated__/BillingSettingsButton_info.graphql';

interface Props {
  info: BillingSettingsButton_info$key | null;
  className?: string;
}

export default function BillingSettingsButton(props: Props) {
  let info = useFragment(
    graphql`
      fragment BillingSettingsButton_info on OwnerInfo {
        billingSettings {
          enabled
          ...BillingSettingsDialog_billingSettings
        }
      }
    `,
    props.info,
  );

  let [openDialog, setOpenDialog] = useState(false);
  if (!info) return null;
  let { className } = props;

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
