import React from 'react';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ReactMarkdown from 'react-markdown';
import { DeliveryInfoDialogLazyContentQueryResponse } from './__generated__/DeliveryInfoDialogLazyContentQuery.graphql';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

const styles = theme =>
  createStyles({
    markdown: {
      color: theme.palette.contrastText,
    },
  });

interface Props extends WithStyles<typeof styles> {
  delivery: DeliveryInfoDialogLazyContentQueryResponse['webhookDelivery'];
}

function DeliveryInfoDialogContent(props: Props) {
  let [value, setValue] = React.useState(0);

  const { delivery, classes } = props;

  let payloadTab = (
    <ReactMarkdown className={classes.markdown} source={'```json\n' + delivery.payload.data + '\n```'} />
  );
  let responseTab = <ReactMarkdown className={classes.markdown} source={'```\n' + delivery.response.data + '\n```'} />;

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

export default withStyles(styles)(DeliveryInfoDialogContent);
