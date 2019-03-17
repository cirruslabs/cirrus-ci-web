import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import Typography from "@material-ui/core/Typography/Typography";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {commitMutation, graphql} from "react-relay";
import environment from "../../createRelayEnvironment";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

const computeCreditsBuyMutation = graphql`
  mutation ComputeCreditsBuyDialogMutation($input: BuyComputeCreditsInput!) {
    buyComputeCredits(input: $input) {
      error
      info {
        id
        balanceInCredits
      }
    }
  }
`;

class ComputeCreditsBuyDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      amountOfCreditsToBuy: 100,
      makingPayment: false
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleBuyCredits = this.handleBuyCredits.bind(this);
  }

  handleAmountChange(event) {
    let amountOfCreditsToBuy = parseInt((event.target.value || "0").replace(/,/g, ""), 10);
    this.setState(prevState => ({
      ...prevState,
      amountOfCreditsToBuy: amountOfCreditsToBuy
    }));
  }

  handleBuyCredits() {
    this.setState(prevState => ({
      ...prevState,
      makingPayment: true
    }));

    const stripe = window.Stripe('pk_live_85E3GON1qCUa1i4Kz9AU76Xo');

    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: this.state.amountOfCreditsToBuy.toLocaleString("en-US", {useGrouping: true}) + " credits",
        amount: 100 * this.state.amountOfCreditsToBuy,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.on('cancel', () => {
      this.setState(prevState => ({
        ...prevState,
        makingPayment: false,
      }));
    });

    paymentRequest.on('token', ({complete, token, ...data}) => {
      const variables = {
        input: {
          clientMutationId: "buy-credits-" + this.props.accountId,
          accountId: this.props.accountId,
          amountOfCredits: this.state.amountOfCreditsToBuy,
          paymentTokenId: token.id,
        },
      };

      commitMutation(
        environment,
        {
          mutation: computeCreditsBuyMutation,
          variables: variables,
          onCompleted: (response) => {
            if (response.error && response.error !== "") {
              complete('fail');
              this.setState(prevState => ({
                ...prevState,
                makingPayment: false,
                error: ("Error " + response.error)
              }));
            } else {
              complete('success');
              this.setState(prevState => ({
                ...prevState,
                makingPayment: false,
              }));
              this.props.onClose();
            }
          },
          onError: err => {
            console.log(err);
            complete('fail');
            this.setState(prevState => ({
              ...prevState,
              makingPayment: false,
              error: err
            }));
          },
        },
      );
    });

    paymentRequest.canMakePayment().then((result) => {
      if (result) {
        paymentRequest.show()
      } else {
        this.setState(prevState => ({
          ...prevState,
          makingPayment: false,
          error: "Can't make payment. Your browser doesn't support Payment Request API " +
            "or you don't have an active payment method in your browser."
        }));
      }
    });
  }

  render() {
    const {classes, ...other} = this.props;

    let error = this.state.error ? <Typography variant="subheading">{this.state.error}</Typography> : null;

    let credits = this.state.amountOfCreditsToBuy;
    return (
      <Dialog {...other}>
        <DialogTitle>Buy Compute Credits</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="credits-amount">Amount of Credits to Buy</InputLabel>
            <Input
              id="credits-amount"
              value={credits.toLocaleString("en-US", {useGrouping: true})}
              onChange={this.handleAmountChange}
            />
            <Typography variant="subheading">
              <p></p>
              <p>
                This amount of compute credits is equal to one of the following:
              </p>
              <ul>
                <li>{(200 * credits).toLocaleString("en-US", {useGrouping: true})} minutes of 1 virtual CPU for
                  Linux
                </li>
                <li>{(100 * credits).toLocaleString("en-US", {useGrouping: true})} minutes of 1 virtual CPU for
                  Windows
                </li>
                <li>{Math.ceil(100 * credits / 3).toLocaleString("en-US", {useGrouping: true})} minutes of 1 real CPU
                  with hyper-threading enabled for macOS.
                </li>
              </ul>
            </Typography>
            {error}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleBuyCredits} disabled={this.state.makingPayment} color="primary" variant="contained">
            Buy {credits.toLocaleString("en-US", {useGrouping: true})} credits
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ComputeCreditsBuyDialog);
