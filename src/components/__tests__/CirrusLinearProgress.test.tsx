import React from 'react';
import CirrusLinearProgress from '../common/CirrusLinearProgress';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';
import { createTheme } from '@mui/material/styles';
import { cirrusLightTheme } from '../../cirrusTheme';
import { ThemeProvider } from '@mui/styles';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <RecoilRoot>
        <ThemeProvider theme={createTheme(cirrusLightTheme)}>
          <CirrusLinearProgress />
        </ThemeProvider>
      </RecoilRoot>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
