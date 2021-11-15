import React from 'react';

import Routes from './AllRoutes';
import { cirrusThemeOptions } from './cirrusTheme';
import { createTheme, ThemeProvider, Theme, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import CirrusFavicon from './components/common/CirrusFavicon';
import { CssBaseline } from '@mui/material';
import { useRecoilValue } from 'recoil';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export default () => {
  const themeOptions = useRecoilValue(cirrusThemeOptions);

  const theme = React.useMemo(() => createTheme(adaptV4Theme(themeOptions)), [themeOptions]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CirrusFavicon />
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
