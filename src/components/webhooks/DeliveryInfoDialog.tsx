import React, { Suspense } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DeliveryInfoDialogLazyContent from './DeliveryInfoDialogLazyContent';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import { DeliveryRow_delivery } from './__generated__/DeliveryRow_delivery.graphql';
import { UnspecifiedCallbackFunction } from '../../utils/utility-types';
import CirrusLinearProgress from './../common/CirrusLinearProgress';

interface Props {
  delivery: DeliveryRow_delivery;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

export default function DeliveryInfoDialog(props: Props) {
  const { delivery, ...other } = props;

  return (
    <Dialog {...other}>
      <DialogTitle>Delivery Info for {delivery.id}</DialogTitle>
      <Suspense fallback={<CirrusLinearProgress />}>
        <DeliveryInfoDialogLazyContent deliveryId={delivery.id} />
      </Suspense>
      <DialogActions>
        <Button onClick={props.onClose} variant="contained" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
