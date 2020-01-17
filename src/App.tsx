// @flow

import React from 'react';

import Routes from './Routes';
import { cirrusTheme } from './cirrusTheme';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import CirrusFavicon from './components/CirrusFavicon';

export default props => {
  return (
    <ThemeProvider theme={createMuiTheme(cirrusTheme)}>
      <CirrusFavicon />
      <Routes />
    </ThemeProvider>
  );
};
