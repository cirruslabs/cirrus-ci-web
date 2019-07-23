// @flow

import React, {Component} from 'react';

import './App.css';
import Routes from './Routes';
import {cirrusTheme} from './cirrusTheme'
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme} from "@material-ui/core";
import CirrusFavicon from "./components/CirrusFavicon";

class App extends Component {
  render() {
    if(location.protocol !== 'https:' && process.env.NODE_ENV !== 'development') location.protocol = 'https:';
    return (
      <ThemeProvider theme={createMuiTheme(cirrusTheme)}>
        <CirrusFavicon/>
        <Routes/>
      </ThemeProvider>
    );
  }
}

export default App;
