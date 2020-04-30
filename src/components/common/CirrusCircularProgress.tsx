import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cirrusColors } from '../../cirrusTheme';

export default () => {
  return <CircularProgress style={{ color: cirrusColors.success }} />;
};
