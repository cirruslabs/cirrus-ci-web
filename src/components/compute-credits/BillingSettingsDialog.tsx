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
import React from 'react';
import { commitMutation, createFragmentContainer } from 'react-relay';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
        accountId
        enabled
        billingCreditsLimit
        billingEmailAddress
        invoiceTemplate
      }
    }
  }
`;

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  billingSettings: BillingSettingsDialog_billingSettings;
  onClose(...args: any[]): void;
  open: boolean;
}

interface State {
  enabled: boolean;
  billingEmailAddress: string;
  invoiceTemplate: string;
}

class BillingSettingsDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let billingSettings = props.billingSettings;
    this.state = {
      enabled: billingSettings.enabled,
      billingEmailAddress: billingSettings.billingEmailAddress,
      invoiceTemplate: billingSettings.invoiceTemplate,
    };
  }

  changeField = field => {
    return event => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  checkField = field => {
    return event => {
      let value = event.target.checked;
      this.setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    };
  };

  updateSettings = () => {
    const variables = {
      input: {
        clientMutationId: 'save-billing-settings-' + this.props.billingSettings.accountId,
        accountId: this.props.billingSettings.accountId,
        enabled: this.state.enabled,
        billingEmailAddress: this.state.billingEmailAddress,
        invoiceTemplate: this.state.invoiceTemplate,
      },
    };
    commitMutation(environment, {
      mutation: saveBillingSettingsMutation,
      variables: variables,
      onCompleted: (response: BillingSettingsDialogMutationResponse) => {
        this.setState(prevState => ({
          ...prevState,
          ...response.saveBillingSettings.settings,
        }));
        this.props.onClose();
      },
      onError: err => console.log(err),
    });
  };

  render() {
    const { billingSettings, classes, ...other } = this.props;

    let notChanged =
      billingSettings.enabled === this.state.enabled &&
      billingSettings.billingEmailAddress === this.state.billingEmailAddress &&
      billingSettings.invoiceTemplate === this.state.invoiceTemplate;

    return (
      <Dialog {...other}>
        <DialogTitle>Compute Credits Auto Pay</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormControlLabel
              control={<Switch checked={this.state.enabled} onChange={this.checkField('enabled')} color="primary" />}
              label="Auto Pay Enabled"
            />
          </FormControl>
          <Typography variant="subtitle1">
            <p>
              By enabling Auto Pay your repositories will be able to use compute credits in advance. You'll be billed in
              the end of each month for the amount of compute credits that your repositories used that month.
            </p>
            <p>
              Your current limit is set to maximum{' '}
              <b className={classes.limit}>{billingSettings.billingCreditsLimit}</b> compute credits that your
              repositories can use each month. To increase the limit please{' '}
              <a href="mailto:support@cirruslabs.org">email support</a>.
            </p>
          </Typography>
          <FormControl fullWidth>
            <InputLabel htmlFor="billingEmailAddress">Billing email address</InputLabel>
            <Input
              id="billingEmailAddress"
              value={this.state.billingEmailAddress}
              error={this.state.enabled && this.state.billingEmailAddress === ''}
              onChange={this.changeField('billingEmailAddress')}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="invoiceTemplate">Invoice Template e.g. P.O Number</InputLabel>
            <Input
              id="invoiceTemplate"
              value={this.state.invoiceTemplate}
              onChange={this.changeField('invoiceTemplate')}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.updateSettings} disabled={notChanged} color="primary" variant="contained">
            Update
          </Button>
          <Button onClick={this.props.onClose} color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(BillingSettingsDialog)), {
  billingSettings: graphql`
    fragment BillingSettingsDialog_billingSettings on BillingSettings {
      accountId
      enabled
      billingCreditsLimit
      billingEmailAddress
      invoiceTemplate
    }
  `,
});
