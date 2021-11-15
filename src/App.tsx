import React from 'react';

import Routes from './AllRoutes';
import { cirrusThemeOptions } from './cirrusTheme';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CirrusFavicon from './components/common/CirrusFavicon';
import { CssBaseline } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

export default () => {
  const themeOptions = useRecoilValue(cirrusThemeOptions);

  const theme = React.useMemo(() => createMuiTheme(themeOptions), [themeOptions]);

  return (
    <ThemeProvider theme={theme}>
      <CirrusFavicon />
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
};
