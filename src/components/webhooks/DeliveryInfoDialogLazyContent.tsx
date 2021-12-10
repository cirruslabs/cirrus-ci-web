import React from 'react';

import { QueryRenderer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import DeliveryInfoDialogContent from './DeliveryInfoDialogContent';
import { DeliveryInfoDialogLazyContentQuery } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';

export default function DeliveryInfoDialogLazyContent(props): JSX.Element {
  let deliveryId = props.deliveryId;
  return (
    <QueryRenderer<DeliveryInfoDialogLazyContentQuery>
      environment={environment}
      variables={{ deliveryId: deliveryId }}
      query={graphql`
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
      `}
      render={({ error, props }) => {
        if (!props) {
          return <CirrusLinearProgress />;
        }
        return <DeliveryInfoDialogContent delivery={props.webhookDelivery} />;
      }}
    />
  );
}
