// @flow

import React, {Component} from 'react';

import './App.css';
import Routes from './Routes';
import {cirrusTheme} from './cirrusTheme'
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import {createMuiTheme} from "@material-ui/core";
import CirrusFavicon from "./components/CirrusFavicon";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(cirrusTheme)}>
        <CirrusFavicon/>
        <Routes/>
      </MuiThemeProvider>
    );
  }
}

export default App;
