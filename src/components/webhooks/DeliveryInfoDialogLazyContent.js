import React from 'react';

import {graphql, QueryRenderer} from 'react-relay';

import environment from '../../createRelayEnvironment';
import CirrusLinearProgress from "../../components/CirrusLinearProgress";
import DeliveryInfoDialogContent from "./DeliveryInfoDialogContent";

const DeliveryInfoDialogLazyContent = (props) => {
  let deliveryId = props.deliveryId;
  return <QueryRenderer
    environment={environment}
    variables={{deliveryId: deliveryId}}
    query={
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
      `
    }

    render={({error, props}) => {
      if (!props) {
        return <CirrusLinearProgress/>
      }
      return <DeliveryInfoDialogContent delivery={props.webhookDelivery}/>
    }}
  />
};

export default DeliveryInfoDialogLazyContent;
