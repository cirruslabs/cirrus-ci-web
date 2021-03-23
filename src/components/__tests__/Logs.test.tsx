import React from 'react';
import Logs from '../logs/Logs';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { cirrusLightTheme } from '../../cirrusTheme';
import { RecoilRoot } from 'recoil';

it('renders correctly', () => {
  const exampleLog = `\
hello world
I am a log
I log things
`;

  const tree = renderer
    .create(
      <RecoilRoot>
        <ThemeProvider theme={createMuiTheme(cirrusLightTheme)}>
          <Router>
            <Switch>
              <Route exact path="/">
                <Logs logs={exampleLog} logsName="test" />
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
