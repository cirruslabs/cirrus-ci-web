import React from 'react';

import Routes from './AllRoutes';
import { cirrusThemeOptions } from './cirrusTheme';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import CirrusFavicon from './components/common/CirrusFavicon';
import { CssBaseline } from '@mui/material';
import { useRecoilValue } from 'recoil';
import * as Sentry from '@sentry/react';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export default function App(): JSX.Element {
  const themeOptions = useRecoilValue(cirrusThemeOptions);

  const theme = React.useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CirrusFavicon />
        <CssBaseline />
        <Sentry.ErrorBoundary>
          <Routes />
        </Sentry.ErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
