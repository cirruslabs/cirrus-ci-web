import React from 'react';

import { useRecoilState } from 'recoil';

import MoonIcon from '@mui/icons-material/Brightness3';
import SunIcon from '@mui/icons-material/BrightnessHigh';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import { prefersDarkModeState } from 'cirrusTheme';

const ThemeSwitchButton = () => {
  let theme = useTheme();
  const [prefersDarkMode, setPreferredMode] = useRecoilState(prefersDarkModeState);

  if (prefersDarkMode) {
    return (
      <Tooltip title="Switch to light theme">
        <IconButton onClick={() => setPreferredMode(false)} size="large">
          <MoonIcon style={{ color: theme.palette.primary.contrastText }} />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Switch to dark theme">
      <IconButton onClick={() => setPreferredMode(true)} size="large">
        <SunIcon style={{ color: theme.palette.warning.light }} />
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitchButton;
