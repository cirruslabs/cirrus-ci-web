import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(theme => {
  return {
    progress: {
      backgroundColor: theme.palette.success.main,
    },
  };
});

const CirrusLinearProgress = () => {
  let classes = useStyles();
  return (
    <LinearProgress
      variant="indeterminate"
      classes={{
        barColorPrimary: classes.progress,
      }}
    />
  );
};

export default CirrusLinearProgress;
