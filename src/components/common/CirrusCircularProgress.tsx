import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core';

export default () => {
  let theme = useTheme();
  return <CircularProgress style={{ color: theme.palette.info.main }} />;
};
