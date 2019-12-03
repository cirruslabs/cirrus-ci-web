import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { cirrusColors } from '../cirrusTheme';
import { withStyles } from '@material-ui/core';

const styles = {
  progress: {
    backgroundColor: cirrusColors.success,
  },
};

const CirrusLinearProgress = props => {
  return (
    <LinearProgress
      variant="indeterminate"
      classes={{
        barColorPrimary: props.classes.progress,
      }}
    />
  );
};

export default withStyles(styles)(CirrusLinearProgress);
