import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/styles';

const styles = theme =>
  createStyles({
    progress: {
      backgroundColor: theme.palette.success.main,
    },
  });

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
