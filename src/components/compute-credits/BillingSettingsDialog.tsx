import React, { useState } from 'react';
import { useMutation, useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';

import mui from 'mui';

import {
  BillingSettingsDialogMutation,
  BillingSettingsDialogMutation$data,
  BillingSettingsDialogMutation$variables,
} from './__generated__/BillingSettingsDialogMutation.graphql';
import { BillingSettingsDialog_billingSettings$key } from './__generated__/BillingSettingsDialog_billingSettings.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    limit: {
      color: mui.colors.orange[700],
      '&:hover': {
        color: mui.colors.orange[900],
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
    <mui.Dialog onClose={props.onClose} open={props.open}>
      <mui.DialogTitle>Compute Credits Auto Pay</mui.DialogTitle>
      <mui.DialogContent>
        <mui.FormControl fullWidth>
          <mui.FormControlLabel
            control={<mui.Switch checked={enabled} onChange={event => setEnabled(event.target.checked)} />}
            label="Auto Pay Enabled"
          />
        </mui.FormControl>
        <mui.Typography variant="subtitle1">
          <p>
            By enabling Auto Pay your repositories will be able to use compute credits in advance. You'll be billed in
            the end of each month for the amount of compute credits that your repositories used that month.
          </p>
          <p>
            Your current limit is set to maximum <b className={classes.limit}>{billingSettings.billingCreditsLimit}</b>{' '}
            compute credits that your repositories can use each month. To increase the limit please{' '}
            <mui.Link color="inherit" href="mailto:support@cirruslabs.org">
              email support
            </mui.Link>
            .
          </p>
        </mui.Typography>
        <mui.FormControl fullWidth>
          <mui.InputLabel htmlFor="billingEmailAddress">Billing email address</mui.InputLabel>
          <mui.Input
            id="billingEmailAddress"
            value={billingEmailAddress}
            error={enabled && billingEmailAddress === ''}
            onChange={event => setBillingEmailAddress(event.target.value)}
          />
        </mui.FormControl>
        <mui.FormControl fullWidth>
          <mui.InputLabel htmlFor="invoiceTemplate">Invoice Template e.g. P.O Number</mui.InputLabel>
          <mui.Input
            id="invoiceTemplate"
            value={invoiceTemplate}
            onChange={event => setInvoiceTemplate(event.target.value)}
          />
        </mui.FormControl>
      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={updateSettings} disabled={notChanged} variant="contained">
          Update
        </mui.Button>
        <mui.Button onClick={props.onClose} color="secondary" variant="contained">
          Close
        </mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
}
