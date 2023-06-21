import React from 'react';

import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import DeliveryInfoDialogContent from './DeliveryInfoDialogContent';
import { DeliveryInfoDialogLazyContentQuery } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';

export default function DeliveryInfoDialogLazyContent(props) {
  let deliveryId = props.deliveryId;

  const response = useLazyLoadQuery<DeliveryInfoDialogLazyContentQuery>(
    graphql`
      query DeliveryInfoDialogLazyContentQuery($deliveryId: String!) {
        webhookDelivery(id: $deliveryId) {
          id
          timestamp
          payload {
            event
            action
            data
          }
          response {
            status
            duration
            data
          }
        }
      }
    `,
    { deliveryId: deliveryId },
  );

  return <DeliveryInfoDialogContent delivery={response.webhookDelivery} />;
}
