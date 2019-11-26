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
  const [isForwards, setIsForwards] = React.useState(true);

  // hacky way to tell react to run this every 2 seconds
  React.useEffect(() => {
    setTimeout(() => setIsForwards(!isForwards), 2000);
  });

  return (
    <LinearProgress
      variant={isForwards ? 'indeterminate' : 'query'}
      classes={{
        barColorPrimary: props.classes.progress,
      }}
    />
  );
};

export default withStyles(styles)(CirrusLinearProgress);
