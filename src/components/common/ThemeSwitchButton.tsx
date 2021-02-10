import React from 'react';
import { prefersDarkModeState } from '../../cirrusTheme';
import { IconButton, Tooltip, useTheme } from '@material-ui/core';
import SunIcon from '@material-ui/icons/BrightnessHigh';
import MoonIcon from '@material-ui/icons/Brightness3';
import { useRecoilState } from 'recoil';

export default () => {
  let theme = useTheme();
  const [prefersDarkMode, setPreferredMode] = useRecoilState(prefersDarkModeState);

  if (prefersDarkMode) {
    return (
      <Tooltip title="Switch to light theme">
        <IconButton onClick={() => setPreferredMode(false)}>
          <MoonIcon style={{ color: theme.palette.primary.contrastText }} />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Switch to dark theme">
      <IconButton onClick={() => setPreferredMode(true)}>
        <SunIcon style={{ color: theme.palette.warning.light }} />
      </IconButton>
    </Tooltip>
  );
};
