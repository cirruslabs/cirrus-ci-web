import React from 'react';
import {CircularProgress} from 'material-ui/Progress';
import {cirrusColors} from "../cirrusTheme";
import {withStyles} from "material-ui";

const styles = {
  progress: {
    color: cirrusColors.success
  }
};

const CirrusCircularProgress = (props) => {
  return <CircularProgress classes={{
    colorPrimary: props.classes.progress,
  }}/>
};

export default withStyles(styles)(CirrusCircularProgress)
