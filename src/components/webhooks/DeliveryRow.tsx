import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { createFragmentContainer } from 'react-relay';
import { graphql } from 'babel-plugin-relay/macro';
import PropTypes from 'prop-types';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import ReportIcon from '@material-ui/icons/Report';
import SendIcon from '@material-ui/icons/Send';
import classNames from 'classnames';
import { cirrusColors } from '../../cirrusTheme';
import DeliveryInfoDialog from './DeliveryInfoDialog';
import { DeliveryRow_delivery } from './__generated__/DeliveryRow_delivery.graphql';

const styles = {
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  delivery: DeliveryRow_delivery;
}

interface State {
  showDetails: boolean;
}

class DeliveryRow extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
    };
  }

  openDialog = () => {
    this.setState({
      showDetails: true,
    });
  };

  closeDialog = () => {
    this.setState({
      showDetails: false,
    });
  };

  render() {
    let { delivery, classes } = this.props;
    let success = 200 <= delivery.response.status && delivery.response.status < 300;
    let iconStyle = { color: success ? cirrusColors.success : cirrusColors.failure };
    return (
      <TableRow hover={true} style={{ cursor: 'pointer' }}>
        <TableCell className={classes.cell} onClick={this.openDialog}>
          <Chip
            label={delivery.id}
            avatar={success ? <SendIcon style={iconStyle} /> : <ReportIcon style={iconStyle} />}
            className={classes.chip}
          />
        </TableCell>
        <TableCell className={classes.cell} onClick={this.openDialog}>
          <Chip
            label={new Date(delivery.timestamp).toLocaleTimeString()}
            className={classNames(classes.chip, 'pull-right')}
          />
        </TableCell>
        <DeliveryInfoDialog delivery={delivery} open={this.state.showDetails} onClose={this.closeDialog} />
      </TableRow>
    );
  }
}

export default createFragmentContainer(withStyles(styles)(withRouter(DeliveryRow)), {
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
