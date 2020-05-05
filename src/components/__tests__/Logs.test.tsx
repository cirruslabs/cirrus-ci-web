import React from 'react';
import Logs from '../logs/Logs';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

it('renders correctly', () => {
  const exampleLog = `\
hello world
I am a log
I log things
`;

  const tree = renderer
    .create(
      <Router>
        <Switch>
          <Route exact path="/">
            <Logs logs={exampleLog} />
          </Route>
        </Switch>
      </Router>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
