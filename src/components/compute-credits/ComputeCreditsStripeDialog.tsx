import { CardElement, Elements, useStripe } from '@stripe/react-stripe-js';
import React, { useState, useMemo } from 'react';
import { useMutation } from 'react-relay';

import { StripeCardElementOptions, Token, StripeCardElement } from '@stripe/stripe-js';
import { graphql } from 'babel-plugin-relay/macro';
import cx from 'classnames';

import mui from 'mui';

import { UnspecifiedCallbackFunction } from 'utils/utility-types';

import {
  ComputeCreditsStripeDialogMutation,
  ComputeCreditsStripeDialogMutation$data,
  ComputeCreditsStripeDialogMutation$variables,
} from './__generated__/ComputeCreditsStripeDialogMutation.graphql';

const useStyles = mui.makeStyles(theme => {
  return {
    inputLabel: {
      '&.Mui-focused': {
        color: theme.palette.text.primary,
      },
    },
    cardInput: {
      '&.StripeElement': {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      },
    },
  };
});

interface Props {
  platform?: string;
  ownerUid: string;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

function ComputeCreditsStripeDialog(props: Props) {
  const theme = mui.useTheme();
  const classes = useStyles();
  const stripe = useStripe();
  const { ownerUid, ...other } = props;
  const [credits, setCredits] = useState(20);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<StripeCardElement | null>(null);

  const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = useMemo(
    () => ({
      hidePostalCode: true,

      style: {
        base: {
          color: theme.palette.text.primary,
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
    }),
    [theme.palette.text.primary],
  );

  const handleAmountChange = event => {
    setCredits(parseInt((event.target.value || '0').replace(/,/g, ''), 10));
  };

  const handleChange = event => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const submitDisabled = useMemo(() => !stripe || !card || paymentInProgress, [stripe, card, paymentInProgress]);

  // Handle form submission.
  const handleSubmit = async event => {
    if (!stripe || !card) return;

    event.preventDefault();
    setPaymentInProgress(true);

    const result = await stripe.createToken(card);
    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message!);
      setPaymentInProgress(false);
    } else {
      setError(null);
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  };

  const [commitComputeCreditsBuyMutation] = useMutation<ComputeCreditsStripeDialogMutation>(graphql`
    mutation ComputeCreditsStripeDialogMutation($input: BuyComputeCreditsInput!) {
      buyComputeCredits(input: $input) {
        error
        info {
          uid
          balanceInCredits
          balanceInCredits
        }
      }
    }
  `);

  const stripeTokenHandler = (token: Token) => {
    const variables: ComputeCreditsStripeDialogMutation$variables = {
      input: {
        clientMutationId: 'buy-credits-' + props.ownerUid,
        platform: props.platform || 'github',
        ownerUid: props.ownerUid,
        amountOfCredits: credits.toString(10),
        paymentTokenId: token.id,
        receiptEmail: receiptEmail,
      },
    };

    commitComputeCreditsBuyMutation({
      variables: variables,
      onCompleted: (response: ComputeCreditsStripeDialogMutation$data, errors) => {
        if (errors && errors.length > 0) {
          setError(errors[0].message);
          return;
        }
        setPaymentInProgress(false);
        if (response.buyComputeCredits.error && response.buyComputeCredits.error !== '') {
          setError(response.buyComputeCredits.error);
        } else {
          setError(null);
          props.onClose();
        }
      },
      onError: error => {
        setPaymentInProgress(false);
        setError(error.message);
      },
    });
  };

  return (
    <mui.Dialog {...other}>
      <mui.DialogTitle>Buy Compute Credits</mui.DialogTitle>
      <mui.DialogContent sx={{ overflowY: 'visible' }}>
        <mui.FormControl fullWidth variant="standard">
          <mui.InputLabel htmlFor="credits-amount" className={classes.inputLabel}>
            Amount of Credits to Buy
          </mui.InputLabel>
          <mui.Input
            id="credits-amount"
            error={credits < 20}
            value={credits.toLocaleString('en-US', { useGrouping: true })}
            inputMode="decimal"
            onChange={handleAmountChange}
            autoFocus
          />
          <mui.FormHelperText id="credits-amount-helper-text" error={credits < 20}>
            The minimum amount of credits you can buy is 20.
          </mui.FormHelperText>
        </mui.FormControl>

        <mui.FormControl fullWidth required={true} variant="standard">
          <mui.InputLabel htmlFor="receipt-email" className={classes.inputLabel}>
            Receipt Email
          </mui.InputLabel>
          <mui.Input
            id="receipt-email"
            value={receiptEmail}
            inputMode="email"
            error={!/\S+@\S+\.\S+/.test(receiptEmail) && receiptEmail !== ''}
            onChange={event => setReceiptEmail(event.target.value)}
          />
        </mui.FormControl>
        <mui.FormControl fullWidth sx={{ marginTop: 2 }}>
          <CardElement
            id="card-element"
            className={cx('form-control', classes.cardInput)}
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleChange}
            onReady={element => setCard(element)}
          />
        </mui.FormControl>
        <mui.Typography color="error" mt={1}>
          {error}
        </mui.Typography>
      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={handleSubmit} disabled={submitDisabled} variant="contained">
          Buy {credits.toLocaleString('en-US', { useGrouping: true })} credits
        </mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
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
