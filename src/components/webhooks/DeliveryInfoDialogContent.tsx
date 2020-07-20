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
  let [value, setValue] = React.useState(0);

  const { delivery } = props;

  let payloadTab = <ReactMarkdown source={'```json\n' + delivery.payload.data + '\n```'} />;
  let responseTab = <ReactMarkdown source={'```\n' + delivery.response.data + '\n```'} />;

  return (
    <DialogContent>
      <Tabs
        value={value}
        onChange={(event, value) => setValue(value)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Payload" />
        <Tab label="Response" />
      </Tabs>
      {value === 0 && payloadTab}
      {value === 1 && responseTab}
    </DialogContent>
  );
};
