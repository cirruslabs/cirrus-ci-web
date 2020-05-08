import React from 'react';

import Routes from './Routes';
import { cirrusTheme } from './cirrusTheme';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, useMediaQuery } from '@material-ui/core';
import CirrusFavicon from './components/common/CirrusFavicon';
import { isDarkTheme, toggleDarkTheme } from './utils/colors';

export default () => {
  const dark: boolean = isDarkTheme(useMediaQuery('(prefers-color-scheme: dark)'));

  React.useEffect(() => toggleDarkTheme());

  return (
    <ThemeProvider theme={createMuiTheme(cirrusTheme(dark))}>
      <CirrusFavicon />
      <Routes />
    </ThemeProvider>
  );
};
