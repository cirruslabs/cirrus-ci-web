import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { commitMutation } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import { UnspecifiedCallbackFunction } from '../../utils/utility-types';

const computeCreditsBuyMutation = graphql`
  mutation ComputeCreditsBuyDialogMutation($input: BuyComputeCreditsInput!) {
    buyComputeCredits(input: $input) {
      error
      info {
        id
        balanceInCredits
      }
      user {
        id
        balanceInCredits
      }
    }
  }
`;

interface Props {
  accountId: number;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

interface State {
  amountOfCreditsToBuy: number;
  makingPayment: boolean;
  error?: string;
}

export default class ComputeCreditsBuyDialog extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      amountOfCreditsToBuy: 100,
      makingPayment: false,
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleBuyCredits = this.handleBuyCredits.bind(this);
  }

  handleAmountChange(event) {
    let amountOfCreditsToBuy = parseInt((event.target.value || '0').replace(/,/g, ''), 10);
    this.setState(prevState => ({
      ...prevState,
      amountOfCreditsToBuy: amountOfCreditsToBuy,
    }));
  }

  handleBuyCredits() {
    this.setState(prevState => ({
      ...prevState,
      makingPayment: true,
    }));

    const stripe = (window as any).Stripe('pk_live_85E3GON1qCUa1i4Kz9AU76Xo');

    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: this.state.amountOfCreditsToBuy.toLocaleString('en-US', { useGrouping: true }) + ' credits',
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

    paymentRequest.on('token', ({ complete, token, ...data }) => {
      const variables = {
        input: {
          clientMutationId: 'buy-credits-' + this.props.accountId,
          accountId: this.props.accountId,
          amountOfCredits: this.state.amountOfCreditsToBuy,
          paymentTokenId: token.id,
        },
      };

      commitMutation(environment, {
        mutation: computeCreditsBuyMutation,
        variables: variables,
        onCompleted: (response: any) => {
          if (response.error && response.error !== '') {
            complete('fail');
            this.setState(prevState => ({
              ...prevState,
              makingPayment: false,
              error: 'Error ' + response.error,
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
            error: (err as unknown) as string,
          }));
        },
      });
    });

    paymentRequest.canMakePayment().then(result => {
      if (result) {
        paymentRequest.show();
      } else {
        this.setState(prevState => ({
          ...prevState,
          makingPayment: false,
          error:
            "Payment failed. Your browser doesn't support the Payment " +
            "Request API, or you don't have an active payment method saved.",
        }));
      }
    });
  }

  render() {
    const { accountId, ...other } = this.props;

    let error = this.state.error ? <Typography variant="subtitle1">{this.state.error}</Typography> : null;

    let credits = this.state.amountOfCreditsToBuy;
    return (
      <Dialog {...other}>
        <DialogTitle>Buy Compute Credits</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel htmlFor="credits-amount">Amount of Credits to Buy</InputLabel>
            <Input
              id="credits-amount"
              value={credits.toLocaleString('en-US', { useGrouping: true })}
              onChange={this.handleAmountChange}
            />
            <Typography variant="subtitle1">
              <p></p>
              <p>This amount of compute credits is equal to one of the following:</p>
              <ul>
                <li>
                  {(200 * credits).toLocaleString('en-US', { useGrouping: true })} minutes of 1 virtual CPU for Linux
                </li>
                <li>
                  {(100 * credits).toLocaleString('en-US', { useGrouping: true })} minutes of 1 virtual CPU for Windows
                </li>
                <li>
                  {Math.ceil((100 * credits) / 3).toLocaleString('en-US', { useGrouping: true })} minutes of 1 real CPU
                  with hyper-threading enabled for macOS.
                </li>
              </ul>
            </Typography>
            {error}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleBuyCredits}
            disabled={this.state.makingPayment}
            color="primary"
            variant="contained"
          >
            Buy {credits.toLocaleString('en-US', { useGrouping: true })} credits
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
