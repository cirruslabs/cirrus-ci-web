import Button from '@mui/material/Button';
import { orange } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { graphql } from 'babel-plugin-relay/macro';
import React, { useState } from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import environment from '../../createRelayEnvironment';
import {
  BillingSettingsDialogMutationResponse,
  BillingSettingsDialogMutationVariables,
} from './__generated__/BillingSettingsDialogMutation.graphql';
import { BillingSettingsDialog_billingSettings } from './__generated__/BillingSettingsDialog_billingSettings.graphql';
import { Link } from '@mui/material';

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
    const variables: BillingSettingsDialogMutationVariables = {
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
