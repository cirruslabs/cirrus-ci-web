// @flow

import React from 'react';

import Routes from './Routes';
import { cirrusTheme } from './cirrusTheme';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CirrusFavicon from './components/common/CirrusFavicon';

export default () => {
  return (
    <ThemeProvider theme={createMuiTheme(cirrusTheme)}>
      <CirrusFavicon />
      <Routes />
    </ThemeProvider>
  );
};
