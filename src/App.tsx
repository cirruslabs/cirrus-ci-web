import React from 'react';

import Routes from './Routes';
import { cirrusTheme } from './cirrusTheme';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, useMediaQuery } from '@material-ui/core';
import CirrusFavicon from './components/common/CirrusFavicon';

export default () => {
  const dark: boolean = useMediaQuery('(prefers-color-scheme: dark)');
  //  || true; // todo

  return (
    <ThemeProvider theme={createMuiTheme(cirrusTheme(dark))}>
      <CirrusFavicon />
      <Routes isDarkTheme={dark} />
    </ThemeProvider>
  );
};
