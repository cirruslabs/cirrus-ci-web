import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeliveryInfoDialogLazyContent from './DeliveryInfoDialogLazyContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { DeliveryRow_delivery } from './__generated__/DeliveryRow_delivery.graphql';
import { UnspecifiedCallbackFunction } from '../../utils/utility-types';

interface Props {
  delivery: DeliveryRow_delivery;
  onClose: UnspecifiedCallbackFunction;
  open: boolean;
}

export default class DeliveryInfoDialog extends React.Component<Props> {
  render() {
    const { delivery, ...other } = this.props;

    return (
      <Dialog {...other}>
        <DialogTitle>Delivery Info for {delivery.id}</DialogTitle>
        <DeliveryInfoDialogLazyContent deliveryId={delivery.id} />
        <DialogActions>
          <Button onClick={this.props.onClose} variant="contained" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
