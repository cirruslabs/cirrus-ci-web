import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import withStyles from '@mui/styles/withStyles';
import { createStyles } from '@mui/styles';

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
