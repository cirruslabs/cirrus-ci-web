import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { cirrusColors } from '../../cirrusTheme';

export default () => (
  <LinearProgress
    variant="indeterminate"
    style={{
      backgroundColor: cirrusColors.success,
    }}
  />
);
