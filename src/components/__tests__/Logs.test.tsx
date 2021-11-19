import React from 'react';
import Logs from '../logs/Logs';
import renderer from 'react-test-renderer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { cirrusLightTheme } from '../../cirrusTheme';
import { RecoilRoot } from 'recoil';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

it('renders correctly', () => {
  const exampleLog = `\
hello world
I am a log
I log things
`;

  const tree = renderer
    .create(
      <RecoilRoot>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={createTheme(cirrusLightTheme)}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Logs logs={exampleLog} logsName="test" />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </StyledEngineProvider>
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
