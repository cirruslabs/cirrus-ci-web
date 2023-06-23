import React, { useState } from 'react';
import { useFragment } from 'react-relay';

import { graphql } from 'babel-plugin-relay/macro';
import classNames from 'classnames';

import ReportIcon from '@mui/icons-material/Report';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';

import DeliveryInfoDialog from './DeliveryInfoDialog';
import { DeliveryRow_delivery$key } from './__generated__/DeliveryRow_delivery.graphql';

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
  delivery: DeliveryRow_delivery$key;
}

export default function DeliveryRow(props: Props) {
  let delivery = useFragment(
    graphql`
      fragment DeliveryRow_delivery on WebHookDelivery {
        id
        timestamp
        response {
          status
        }
      }
    `,
    props.delivery,
  );

  let [showDetails, setShowDetails] = useState(false);
  let theme = useTheme();

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
