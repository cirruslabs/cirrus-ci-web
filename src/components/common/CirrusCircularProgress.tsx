import React from 'react';

import { useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CirrusCircularProgress = () => {
  let theme = useTheme();
  return <CircularProgress style={{ color: theme.palette.info.main }} />;
};

export default CirrusCircularProgress;
