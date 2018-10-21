import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {withStyles} from "@material-ui/core";
import DeliveryRow from "./DeliveryRow";

class DeliveriesList extends React.Component {
  render() {
    let deliveryEdges = (this.props.deliveries || {}).edges || [];
    let deliveries = deliveryEdges.map(edge => edge.node);
    return (
      <Table style={{tableLayout: 'auto'}}>
        <TableBody>
          {deliveries.map(delivery => <DeliveryRow key={delivery.__id} delivery={delivery}/>)}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles({})(DeliveriesList);
