import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material';

const CirrusCircularProgress = () => {
  let theme = useTheme();
  return <CircularProgress style={{ color: theme.palette.info.main }} />;
};

export default CirrusCircularProgress;
