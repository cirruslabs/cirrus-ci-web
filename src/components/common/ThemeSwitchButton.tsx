import React from 'react';
import { prefersDarkModeState } from '../../cirrusTheme';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import SunIcon from '@mui/icons-material/BrightnessHigh';
import MoonIcon from '@mui/icons-material/Brightness3';
import { useRecoilState } from 'recoil';

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
