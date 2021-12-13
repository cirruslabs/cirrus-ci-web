import React, { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { commitMutation } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import environment from '../../createRelayEnvironment';
import { UnspecifiedCallbackFunction } from '../../utils/utility-types';
import {
  ComputeCreditsStripeDialogMutationResponse,
  ComputeCreditsStripeDialogMutationVariables,
} from './__generated__/ComputeCreditsStripeDialogMutation.graphql';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { StripeCardElementOptions, Token } from '@stripe/stripe-js';

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
  hidePostalCode: true,
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface Props {
  platform?: string;
  ownerUid: string;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

function ComputeCreditsStripeDialog(props: Props) {
  const { ownerUid, ...other } = props;

  const [credits, setCredits] = useState(100);
  const handleAmountChange = event => {
    setCredits(parseInt((event.target.value || '0').replace(/,/g, ''), 10));
  };
  const [receiptEmail, setReceiptEmail] = useState('');

  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = event => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  // Handle form submission.
  const handleSubmit = async event => {
    event.preventDefault();
    setPaymentInProgress(true);
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message);
      setPaymentInProgress(false);
    } else {
      setError(null);
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  };

  const stripeTokenHandler = (token: Token) => {
    const variables: ComputeCreditsStripeDialogMutationVariables = {
      input: {
        clientMutationId: 'buy-credits-' + props.ownerUid,
        platform: props.platform || 'github',
        ownerUid: props.ownerUid,
        amountOfCredits: credits.toString(10),
        paymentTokenId: token.id,
        receiptEmail: receiptEmail,
      },
    };

    commitMutation(environment, {
      mutation: computeCreditsBuyMutation,
      variables: variables,
      onCompleted: (response: ComputeCreditsStripeDialogMutationResponse) => {
        setPaymentInProgress(false);
        if (response.buyComputeCredits.error && response.buyComputeCredits.error !== '') {
          setError(response.buyComputeCredits.error);
        } else {
          setError(null);
          props.onClose();
        }
      },
      onError: err => {
        setPaymentInProgress(false);
        setError(err);
      },
    });
  };

  return (
    <Dialog {...other}>
      <DialogTitle>Buy Compute Credits</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel htmlFor="credits-amount">Amount of Credits to Buy</InputLabel>
          <Input
            id="credits-amount"
            value={credits.toLocaleString('en-US', { useGrouping: true })}
            inputMode="decimal"
            onChange={handleAmountChange}
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
        </FormControl>
        <FormControl fullWidth>
          <CardElement
            id="card-element"
            className="form-control"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth required={true}>
          <InputLabel htmlFor="receipt-email">Receipt Email</InputLabel>
          <Input
            id="receipt-email"
            value={receiptEmail}
            inputMode="email"
            error={!/\S+@\S+\.\S+/.test(receiptEmail)}
            onChange={event => setReceiptEmail(event.target.value)}
          />
        </FormControl>
        {error}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} disabled={paymentInProgress} variant="contained">
          Buy {credits.toLocaleString('en-US', { useGrouping: true })} credits
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ComputeCreditsStripeDialogComponent(props: Props) {
  // Setup Stripe.js and the Elements provider
  const stripe = (window as any).Stripe('pk_live_85E3GON1qCUa1i4Kz9AU76Xo');
  return (
    <Elements stripe={stripe}>
      <ComputeCreditsStripeDialog {...props} />
    </Elements>
  );
}
