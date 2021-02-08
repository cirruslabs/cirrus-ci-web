import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cirrusColorsState } from '../../cirrusTheme';
import { useRecoilValue } from 'recoil';

export default () => {
  const cirrusColors = useRecoilValue(cirrusColorsState);
  return <CircularProgress style={{ color: cirrusColors.success }} />;
};
