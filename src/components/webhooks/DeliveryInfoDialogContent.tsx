import React from 'react';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactMarkdown from 'react-markdown';
import { DeliveryInfoDialogLazyContentQueryResponse } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';

interface Props {
  delivery: DeliveryInfoDialogLazyContentQueryResponse['webhookDelivery'];
}

export default class DeliveryInfoDialogContent extends React.Component<Props> {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState(prevState => ({
      ...prevState,
      value: value,
    }));
  };

  render() {
    const { delivery } = this.props;

    let payloadTab = <ReactMarkdown source={'```json\n' + delivery.payload.data + '\n```'} />;

    let responseTab = <ReactMarkdown source={'```\n' + delivery.response.data + '\n```'} />;

    return (
      <DialogContent>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Payload" />
          <Tab label="Response" />
        </Tabs>
        {this.state.value === 0 && payloadTab}
        {this.state.value === 1 && responseTab}
      </DialogContent>
    );
  }
}
