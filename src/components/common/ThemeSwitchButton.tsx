import React from 'react';
import { prefersDarkModeState } from '../../cirrusTheme';
import { IconButton } from '@material-ui/core';
import SunIcon from '@material-ui/icons/BrightnessHigh';
import MoonIcon from '@material-ui/icons/Brightness3';
import { useRecoilState } from 'recoil';

export default () => {
  const [prefersDarkMode, setPreferredMode] = useRecoilState(prefersDarkModeState);

  if (prefersDarkMode) {
    return (
      <IconButton aria-label="switch-to-light" onClick={() => setPreferredMode(false)}>
        <MoonIcon />
      </IconButton>
    );
  }
  return (
    <IconButton aria-label="switch-to-light" onClick={() => setPreferredMode(true)}>
      <SunIcon />
    </IconButton>
  );
};
