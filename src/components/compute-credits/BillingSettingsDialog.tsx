import React, { useState } from 'react';
import { useMutation, useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import { Link } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

import {
  BillingSettingsDialogMutation,
  BillingSettingsDialogMutation$data,
  BillingSettingsDialogMutation$variables,
} from './__generated__/BillingSettingsDialogMutation.graphql';
import { BillingSettingsDialog_billingSettings$key } from './__generated__/BillingSettingsDialog_billingSettings.graphql';

const useStyles = makeStyles(theme => {
  return {
    limit: {
      color: orange[700],
      '&:hover': {
        color: orange[900],
      },
    },
  };
});

interface Props {
  billingSettings: BillingSettingsDialog_billingSettings$key;

  onClose(...args: any[]): void;

  open: boolean;
}

export default function BillingSettingsDialog(props: Props) {
  let billingSettings = useFragment(
    graphql`
      fragment BillingSettingsDialog_billingSettings on BillingSettings {
        platform
        ownerUid
        enabled
        billingCreditsLimit
        billingEmailAddress
        invoiceTemplate
      }
    `,
    props.billingSettings,
  );
  let classes = useStyles();
  let [enabled, setEnabled] = useState(billingSettings.enabled);
  let [billingEmailAddress, setBillingEmailAddress] = useState(billingSettings.billingEmailAddress);
  let [invoiceTemplate, setInvoiceTemplate] = useState(billingSettings.invoiceTemplate);

  let notChanged =
    billingSettings.enabled === enabled &&
    billingSettings.billingEmailAddress === billingEmailAddress &&
    billingSettings.invoiceTemplate === invoiceTemplate;

  const [commitSaveBillingSettingsMutation] = useMutation<BillingSettingsDialogMutation>(graphql`
    mutation BillingSettingsDialogMutation($input: BillingSettingsInput!) {
      saveBillingSettings(input: $input) {
        settings {
          platform
          ownerUid
          enabled
          billingCreditsLimit
          billingEmailAddress
          invoiceTemplate
        }
      }
    }
  `);
  function updateSettings() {
    const variables: BillingSettingsDialogMutation$variables = {
      input: {
        platform: billingSettings.platform,
        clientMutationId: 'save-billing-settings-' + billingSettings.ownerUid,
        ownerUid: billingSettings.ownerUid,
        enabled: enabled,
        billingEmailAddress: billingEmailAddress,
        invoiceTemplate: invoiceTemplate,
      },
    };
    commitSaveBillingSettingsMutation({
      variables: variables,
      onCompleted: (response: BillingSettingsDialogMutation$data, errors) => {
        if (errors) {
          console.log(errors);
          return;
        }
        setEnabled(response.saveBillingSettings.settings.enabled);
        setBillingEmailAddress(response.saveBillingSettings.settings.billingEmailAddress);
        setInvoiceTemplate(response.saveBillingSettings.settings.invoiceTemplate);
        props.onClose();
      },
      onError: err => console.log(err),
    });
  }

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Compute Credits Auto Pay</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={event => setEnabled(event.target.checked)} />}
            label="Auto Pay Enabled"
          />
        </FormControl>
        <Typography variant="subtitle1">
          <p>
            By enabling Auto Pay your repositories will be able to use compute credits in advance. You'll be billed in
            the end of each month for the amount of compute credits that your repositories used that month.
          </p>
          <p>
            Your current limit is set to maximum <b className={classes.limit}>{billingSettings.billingCreditsLimit}</b>{' '}
            compute credits that your repositories can use each month. To increase the limit please{' '}
            <Link color="inherit" href="mailto:support@cirruslabs.org">
              email support
            </Link>
            .
          </p>
        </Typography>
        <FormControl fullWidth>
          <InputLabel htmlFor="billingEmailAddress">Billing email address</InputLabel>
          <Input
            id="billingEmailAddress"
            value={billingEmailAddress}
            error={enabled && billingEmailAddress === ''}
            onChange={event => setBillingEmailAddress(event.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="invoiceTemplate">Invoice Template e.g. P.O Number</InputLabel>
          <Input
            id="invoiceTemplate"
            value={invoiceTemplate}
            onChange={event => setInvoiceTemplate(event.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={updateSettings} disabled={notChanged} variant="contained">
          Update
        </Button>
        <Button onClick={props.onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
