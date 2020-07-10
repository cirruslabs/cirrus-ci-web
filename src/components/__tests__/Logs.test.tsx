import React from 'react';
import Logs from '../logs/Logs';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { cirrusTheme } from '../../cirrusTheme';

it('renders correctly', () => {
  const exampleLog = `\
hello world
I am a log
I log things
`;

  const tree = renderer
    .create(
      <ThemeProvider theme={createMuiTheme(cirrusTheme)}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Logs logs={exampleLog} />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
