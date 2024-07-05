import * as Sentry from '@sentry/react';
import React, { Suspense } from 'react';

import Button from '@mui/material/Button/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import CirrusLinearProgress from 'components/common/CirrusLinearProgress';
import { UnspecifiedCallbackFunction } from 'utils/utility-types';

import DeliveryInfoDialogLazyContent from './DeliveryInfoDialogLazyContent';
import { DeliveryRow_delivery$data } from './__generated__/DeliveryRow_delivery.graphql';

interface Props {
  delivery: DeliveryRow_delivery$data;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

export default function DeliveryInfoDialog(props: Props) {
  const { delivery, ...other } = props;

  return (
    <Dialog {...other}>
      <DialogTitle>Delivery Info for {delivery.id}</DialogTitle>
      <Sentry.ErrorBoundary fallback={<CirrusLinearProgress />}>
        <Suspense fallback={<CirrusLinearProgress />}>
          <DeliveryInfoDialogLazyContent deliveryId={delivery.id} />
        </Suspense>
      </Sentry.ErrorBoundary>
      <DialogActions>
        <Button onClick={props.onClose} variant="contained" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
