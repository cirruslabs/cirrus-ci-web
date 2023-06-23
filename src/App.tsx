import * as Sentry from '@sentry/react';
import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';

import { useRecoilValue } from 'recoil';

import { CssBaseline } from '@mui/material';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';

import environment from 'createRelayEnvironment';

import CirrusFavicon from 'components/common/CirrusFavicon';

import Routes from './AllRoutes';
import { cirrusThemeOptions } from './cirrusTheme';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export default function App() {
  const themeOptions = useRecoilValue(cirrusThemeOptions);

  const theme = React.useMemo(() => createTheme(themeOptions), [themeOptions]);

  return (
    // @ts-ignore
    <RelayEnvironmentProvider environment={environment}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CirrusFavicon />
          <CssBaseline />
          <Sentry.ErrorBoundary>
            <Routes />
          </Sentry.ErrorBoundary>
        </ThemeProvider>
      </StyledEngineProvider>
    </RelayEnvironmentProvider>
  );
}
