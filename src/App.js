// @flow

import React, {Component} from 'react';

import './App.css';
import Routes from './Routes';
import {cirrusTheme} from './cirrusTheme'
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme} from "@material-ui/core";
import CirrusFavicon from "./components/CirrusFavicon";
import HttpsRedirect from 'react-https-redirect';

class App extends Component {
  render() {
    return (
      <HttpsRedirect>
        <ThemeProvider theme={createMuiTheme(cirrusTheme)}>
          <CirrusFavicon/>
          <Routes/>
        </ThemeProvider>
      </HttpsRedirect>
    );
  }
}

export default App;
