import React from 'react';
import Logs from '../logs/Logs';
import renderer from 'react-test-renderer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Logs logs={exampleLog} logsName="test" />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
