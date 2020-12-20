import React, {useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import {commitMutation} from 'react-relay';
import {graphql} from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import {UnspecifiedCallbackFunction} from '../../utils/utility-types';
import {
  BuyComputeCreditsInput,
  ComputeCreditsStripeDialogMutationResponse
} from './__generated__/ComputeCreditsStripeDialogMutation.graphql';
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import {StripeCardElementOptions, Token} from "@stripe/stripe-js";

const computeCreditsBuyMutation = graphql`
  mutation ComputeCreditsStripeDialogMutation($input: BuyComputeCreditsInput!) {
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

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

interface Props {
  accountId: number;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

function ComputeCreditsStripeDialog(props: Props) {
  const {accountId, ...other} = props;

  const [credits, setCredits] = useState(100);
  const handleAmountChange = (event) => {
    setCredits(parseInt((event.target.value || '0').replace(/,/g, ''), 10));
  }

  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  }

  // Handle form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message);
    } else {
      setError(null);
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  };

  const stripeTokenHandler = (token: Token) => {
    const input: BuyComputeCreditsInput = {
      clientMutationId: 'buy-credits-' + props.accountId,
      accountId: props.accountId.toString(10),
      amountOfCredits: credits.toString(10),
      paymentTokenId: token.id,
    };

    commitMutation(environment, {
      mutation: computeCreditsBuyMutation,
      variables: {input: input},
      onCompleted: (response: ComputeCreditsStripeDialogMutationResponse) => {
        if (response.buyComputeCredits.error && response.buyComputeCredits.error !== '') {
          setError(response.buyComputeCredits.error);
        } else {
          setError(null);
          props.onClose();
        }
      },
      onError: err => {
        setError(err);
      },
    });
  }

  return (
    <Dialog {...other}>
      <DialogTitle>Buy Compute Credits</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="credits-amount">Amount of Credits to Buy</InputLabel>
          <Input
            id="credits-amount"
            value={credits.toLocaleString('en-US', {useGrouping: true})}
            onChange={handleAmountChange}
          />
          <Typography variant="subtitle1">
            <p></p>
            <p>This amount of compute credits is equal to one of the following:</p>
            <ul>
              <li>
                {(200 * credits).toLocaleString('en-US', {useGrouping: true})} minutes of 1 virtual CPU for Linux
              </li>
              <li>
                {(100 * credits).toLocaleString('en-US', {useGrouping: true})} minutes of 1 virtual CPU for Windows
              </li>
              <li>
                {Math.ceil((100 * credits) / 3).toLocaleString('en-US', {useGrouping: true})} minutes of 1 real CPU
                with hyper-threading enabled for macOS.
              </li>
            </ul>
          </Typography>
          <FormControl fullWidth>
            <CardElement
              id="card-element"
              className="form-control"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleChange}
            />
          </FormControl>
          {error}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained">
          Buy {credits.toLocaleString('en-US', {useGrouping: true})} credits
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default function (props: Props) {
  // Setup Stripe.js and the Elements provider
  const stripe = (window as any).Stripe('pk_live_85E3GON1qCUa1i4Kz9AU76Xo');
  return (
    <Elements stripe={stripe}>
      <ComputeCreditsStripeDialog {...props}/>
    </Elements>
  );
}
