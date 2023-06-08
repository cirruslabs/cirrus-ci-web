import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import DeliveryRow from './DeliveryRow';
import { getNodesFromConnection } from '../../utils/graphql';
import { WebHookSettings_info$data } from './__generated__/WebHookSettings_info.graphql';

interface Props {
  deliveries: WebHookSettings_info$data['webhookDeliveries'];
}

const DeliveriesList = (props: Props) => {
  const deliveries = props.deliveries ? getNodesFromConnection(props.deliveries) : [];
  return (
    <Table style={{ tableLayout: 'auto' }}>
      <TableBody>
        {deliveries.map((delivery: any) => (
          <DeliveryRow key={delivery.__id} delivery={delivery} />
        ))}
      </TableBody>
    </Table>
  );
};

export default DeliveriesList;
