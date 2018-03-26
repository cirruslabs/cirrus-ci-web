import React from 'react';
import {LinearProgress} from 'material-ui/Progress';
import {cirrusColors} from "../cirrusTheme";
import {withStyles} from "material-ui";

const styles = {
  progress: {
    backgroundColor: cirrusColors.success
  }
};

const CirrusLinearProgress = (props) => {
  return <LinearProgress mode="indeterminate"
                         classes={{
                           barColorPrimary: props.classes.progress,
                         }}/>
};

export default withStyles(styles)(CirrusLinearProgress)
