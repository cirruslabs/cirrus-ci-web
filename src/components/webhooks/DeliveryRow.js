import React from 'react';
import {withRouter} from 'react-router-dom'

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import {createFragmentContainer} from "react-relay";
import graphql from 'babel-plugin-relay/macro';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import ReportIcon from '@material-ui/icons/Report';
import SendIcon from '@material-ui/icons/Send';
import classNames from "classnames";
import {cirrusColors} from "../../cirrusTheme";
import DeliveryInfoDialog from "./DeliveryInfoDialog";

const styles = {
  chip: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
  },
  cell: {
    padding: 0,
    height: "100%",
  },
};

class DeliveryRow extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      showDetails: false
    };
  }

  openDialog = () => {
    this.setState({
      showDetails: true
    });
  };

  closeDialog = () => {
    this.setState({
      showDetails: false
    });
  };

  render() {
    let {delivery, classes} = this.props;
    let success = 200 <= delivery.response.status && delivery.response.status < 300;
    let iconStyle = {color: (success ? cirrusColors.success : cirrusColors.failure)};
    return (
      <TableRow hover={true}
                style={{cursor: "pointer"}}>
        <TableCell className={classes.cell} onClick={this.openDialog}>
          <Chip label={delivery.id}
                avatar={success ? <SendIcon style={iconStyle}/> : <ReportIcon style={iconStyle}/>}
                className={classes.chip}/>
        </TableCell>
        <TableCell className={classes.cell} onClick={this.openDialog}>
          <Chip label={new Date(delivery.timestamp).toLocaleTimeString()}
                className={classNames(classes.chip, "pull-right")}/>
        </TableCell>
        <DeliveryInfoDialog
          delivery={delivery}
          open={this.state.showDetails}
          onClose={this.closeDialog}
        />
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(DeliveryRow)), {
  delivery: graphql`
    fragment DeliveryRow_delivery on WebHookDelivery {
        id
        timestamp
        payload {
          event
          action
        }
        response {
          status
          duration
        }
    }
  `,
});
