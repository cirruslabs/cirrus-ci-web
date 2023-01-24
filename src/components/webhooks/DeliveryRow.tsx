import React, { useState } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import { makeStyles } from '@mui/styles';
import ReportIcon from '@mui/icons-material/Report';
import SendIcon from '@mui/icons-material/Send';
import classNames from 'classnames';
import DeliveryInfoDialog from './DeliveryInfoDialog';
import { DeliveryRow_delivery } from './__generated__/DeliveryRow_delivery.graphql';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material';

const useStyles = makeStyles(theme => {
  return {
    chip: {
      marginTop: 4,
      marginBottom: 4,
      marginLeft: 4,
    },
    cell: {
      padding: 0,
      height: '100%',
    },
  };
});

interface Props {
  delivery: DeliveryRow_delivery;
}

function DeliveryRow(props: Props) {
  let [showDetails, setShowDetails] = useState(false);
  let theme = useTheme();

  let { delivery } = props;
  let classes = useStyles();

  let success = 200 <= delivery.response.status && delivery.response.status < 300;
  let statusColor = success ? theme.palette.success.main : theme.palette.error.main;
  return (
    <TableRow hover={true} style={{ cursor: 'pointer' }}>
      <TableCell className={classes.cell} onClick={() => setShowDetails(true)}>
        <Chip
          label={delivery.id}
          avatar={
            <Avatar style={{ backgroundColor: statusColor }}>
              {success ? (
                <SendIcon style={{ color: theme.palette.primary.contrastText }} />
              ) : (
                <ReportIcon style={{ color: theme.palette.primary.contrastText }} />
              )}
            </Avatar>
          }
          className={classes.chip}
        />
      </TableCell>
      <TableCell className={classes.cell} onClick={() => setShowDetails(true)}>
        <Chip
          label={new Date(delivery.timestamp).toLocaleTimeString()}
          className={classNames(classes.chip, 'pull-right')}
        />
      </TableCell>
      <DeliveryInfoDialog delivery={delivery} open={showDetails} onClose={() => setShowDetails(false)} />
    </TableRow>
  );
}

export default createFragmentContainer(DeliveryRow, {
  delivery: graphql`
    fragment DeliveryRow_delivery on WebHookDelivery {
      id
      timestamp
      response {
        status
      }
    }
  `,
});
