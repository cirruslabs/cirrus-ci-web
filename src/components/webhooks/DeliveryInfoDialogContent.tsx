import React from 'react';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactMarkdown from 'react-markdown';
import { DeliveryInfoDialogLazyContentQueryResponse } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';

interface Props {
  delivery: DeliveryInfoDialogLazyContentQueryResponse['webhookDelivery'];
}

export default (props: Props) => {
  let [state, setState] = React.useState(null);

  let handleChange = (event, value) => setState(value);

  const { delivery } = props;

  let payloadTab = <ReactMarkdown source={'```json\n' + delivery.payload.data + '\n```'} />;

  let responseTab = <ReactMarkdown source={'```\n' + delivery.response.data + '\n```'} />;

  return (
    <DialogContent>
      <Tabs value={state} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Payload" />
        <Tab label="Response" />
      </Tabs>
      {value === 0 && payloadTab}
      {value === 1 && responseTab}
    </DialogContent>
  );
};
