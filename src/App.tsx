import React from 'react';

import Routes from './Routes';
import { cirrusDarkTheme, cirrusLightTheme, prefersDarkModeState } from './cirrusTheme';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CirrusFavicon from './components/common/CirrusFavicon';
import { CssBaseline } from '@material-ui/core';
import { useRecoilState } from 'recoil';

export default () => {
  const [prefersDarkMode] = useRecoilState(prefersDarkModeState);

  const theme = React.useMemo(() => createMuiTheme(prefersDarkMode ? cirrusDarkTheme : cirrusLightTheme), [
    prefersDarkMode,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CirrusFavicon />
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
};
