import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cirrusColors } from '../../cirrusTheme';
import { withStyles } from '@material-ui/core';

const styles = {
  progress: {
    color: cirrusColors.success,
  },
};

const CirrusCircularProgress = props => {
  return (
    <CircularProgress
      classes={{
        colorPrimary: props.classes.progress,
      }}
    />
  );
};

export default withStyles(styles)(CirrusCircularProgress);
