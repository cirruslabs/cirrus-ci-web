// @flow

import React, { Component } from 'react';

import Routes from './Routes';
import { asMuiTheme } from './cirrusTheme';
import { ThemeProvider } from '@material-ui/styles';
import CirrusFavicon from './components/CirrusFavicon';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={asMuiTheme}>
        <CirrusFavicon />
        <Routes />
      </ThemeProvider>
    );
  }
}

export default App;
