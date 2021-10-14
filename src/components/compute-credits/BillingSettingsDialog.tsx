import Button from '@material-ui/core/Button';
import { orange } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import environment from '../../createRelayEnvironment';
import { BillingSettingsDialogMutationResponse } from './__generated__/BillingSettingsDialogMutation.graphql';
import { BillingSettingsDialog_billingSettings } from './__generated__/BillingSettingsDialog_billingSettings.graphql';

const styles = theme =>
  createStyles({
    limit: {
      color: orange[700],
      '&:hover': {
        color: orange[900],
      },
    },
  });

const saveBillingSettingsMutation = graphql`
  mutation BillingSettingsDialogMutation($input: BillingSettingsInput!) {
    saveBillingSettings(input: $input) {
      settings {
        ownerUid
        enabled
        billingCreditsLimit
        billingEmailAddress
        invoiceTemplate
      }
    }
  }
`;

interface Props extends WithStyles<typeof styles> {
  billingSettings: BillingSettingsDialog_billingSettings;

  onClose(...args: any[]): void;

  open: boolean;
}

function BillingSettingsDialog(props: Props) {
  const { billingSettings, classes, ...other } = props;
  let [enabled, setEnabled] = useState(billingSettings.enabled);
  let [billingEmailAddress, setBillingEmailAddress] = useState(billingSettings.billingEmailAddress);
  let [invoiceTemplate, setInvoiceTemplate] = useState(billingSettings.invoiceTemplate);

  let notChanged =
    billingSettings.enabled === enabled &&
    billingSettings.billingEmailAddress === billingEmailAddress &&
    billingSettings.invoiceTemplate === invoiceTemplate;

  function updateSettings() {
    const variables = {
      input: {
        clientMutationId: 'save-billing-settings-' + props.billingSettings.ownerUid,
        ownerUid: props.billingSettings.ownerUid,
        enabled: enabled,
        billingEmailAddress: billingEmailAddress,
        invoiceTemplate: invoiceTemplate,
      },
    };
    commitMutation(environment, {
      mutation: saveBillingSettingsMutation,
      variables: variables,
      onCompleted: (response: BillingSettingsDialogMutationResponse) => {
        setEnabled(response.saveBillingSettings.settings.enabled);
        setBillingEmailAddress(response.saveBillingSettings.settings.billingEmailAddress);
        setInvoiceTemplate(response.saveBillingSettings.settings.invoiceTemplate);
        props.onClose();
      },
      onError: err => console.log(err),
    });
  }

  return (
    <Dialog {...other}>
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
            <a href="mailto:support@cirruslabs.org">email support</a>.
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

export default createFragmentContainer(withStyles(styles)(BillingSettingsDialog), {
  billingSettings: graphql`
    fragment BillingSettingsDialog_billingSettings on BillingSettings {
      ownerUid
      enabled
      billingCreditsLimit
      billingEmailAddress
      invoiceTemplate
    }
  `,
});
