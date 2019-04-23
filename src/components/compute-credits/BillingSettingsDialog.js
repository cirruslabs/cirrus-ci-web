import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {commitMutation, createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {orange} from "@material-ui/core/colors";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import environment from "../../createRelayEnvironment";

const styles = theme => ({
  limit: {
    color: orange[700],
    '&:hover': {
      color: orange[900],
    },
  }
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

class BillingSettingsDialog extends React.Component {
  constructor(props) {
    super();
    let billingSettings = props.billingSettings;
    this.state = {
      enabled: billingSettings.enabled,
      billingEmailAddress: billingSettings.billingEmailAddress,
      invoiceTemplate: billingSettings.invoiceTemplate,
    };
  }

  changeField = (field) => {
    return (event) => {
      let value = event.target.value;
      this.setState(prevState => ({
        ...prevState,
        [field]: value
      }));
    };
  };

  checkField = (field) => {
    return (event) => {
      let value = event.target.checked;
      this.setState(prevState => ({
        ...prevState,
        [field]: value
      }));
    };
  };

  updateSettings = () => {
    const variables = {
      input: {
        clientMutationId: "save-billing-settings-" + this.props.billingSettings.accountId,
        accountId: this.props.billingSettings.accountId,
        enabled: this.state.enabled,
        billingEmailAddress: this.state.billingEmailAddress,
        invoiceTemplate: this.state.invoiceTemplate,
      },
    };
    commitMutation(
      environment,
      {
        mutation: saveBillingSettingsMutation,
        variables: variables,
        onCompleted: (response) => {
          this.setState(prevState => ({
            ...prevState,
            ...response.saveBillingSettings.settings,
          }));
          this.props.onClose();
        },
        onError: err => {
          console.log(err);
        },
      },
    );
  };


  render() {
    const {billingSettings, classes, ...other} = this.props;

    let notChanged = billingSettings.enabled === this.state.enabled
      && billingSettings.billingEmailAddress === this.state.billingEmailAddress
      && billingSettings.invoiceTemplate === this.state.invoiceTemplate;

    return (
      <Dialog {...other}>
        <DialogTitle>Compute Credits Auto Pay</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.margin}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.enabled}
                  onChange={this.checkField('enabled')}
                  color="primary"
                />
              }
              label="Auto Pay Enabled"
            />
          </FormControl>
          <Typography variant="subtitle1">
            <p>
              By enabling Auto Pay your repositories will be able to use compute credits in advance. You'll be billed in
              the end of each month for the amount of compute credits that your repositories used that month.
            </p>
            <p>
              Your current limit is set to maximum <b
              className={classes.limit}>{billingSettings.billingCreditsLimit}</b> compute credits
              that your repositories can use each month. To increase the limit please <a
              href="mailto:support@cirruslabs.org">email support</a>.
            </p>
          </Typography>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="billingEmailAddress">Billing email address</InputLabel>
            <Input id="billingEmailAddress" value={this.state.billingEmailAddress}
                   error={this.state.enabled && this.state.billingEmailAddress === ''}
                   onChange={this.changeField('billingEmailAddress')}
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="invoiceTemplate">Invoice Template e.g. P.O Number</InputLabel>
            <Input id="invoiceTemplate" value={this.state.invoiceTemplate}
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


export default createFragmentContainer(withRouter(withStyles(styles)(BillingSettingsDialog)), {
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
