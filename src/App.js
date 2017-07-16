// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import './App.css';
import Routes from './Routes';
import {cirrusTheme} from './cirrusTheme'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(cirrusTheme)}>
        <Routes/>
      </MuiThemeProvider>
    );
  }
}

export default App;
