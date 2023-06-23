import React from 'react';
import renderer from 'react-test-renderer';

import { RecoilRoot } from 'recoil';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';

import { cirrusLightTheme } from 'cirrusTheme';

import CirrusLinearProgress from 'components/common/CirrusLinearProgress';

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
