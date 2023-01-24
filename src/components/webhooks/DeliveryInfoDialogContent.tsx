import React from 'react';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DeliveryInfoDialogLazyContentQueryResponse } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';
import { makeStyles } from '@mui/styles';
import MarkdownTypography from '../common/MarkdownTypography';

const useStyles = makeStyles(theme => {
  return {
    markdown: {
      color: theme.palette.primary.contrastText,
    },
  };
});

interface Props {
  delivery: DeliveryInfoDialogLazyContentQueryResponse['webhookDelivery'];
}

function DeliveryInfoDialogContent(props: Props) {
  let [value, setValue] = React.useState(0);

  const { delivery } = props;
  let classes = useStyles();

  let payloadTab = (
    <MarkdownTypography className={classes.markdown} text={'```json\n' + delivery.payload.data + '\n```'} />
  );
  let responseTab = (
    <MarkdownTypography className={classes.markdown} text={'```\n' + delivery.response.data + '\n```'} />
  );

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
}

export default DeliveryInfoDialogContent;
