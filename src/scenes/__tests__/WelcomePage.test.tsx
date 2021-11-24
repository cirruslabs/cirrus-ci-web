import React from 'react';
import WelcomePage from '../Home/WelcomePage';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { cirrusDarkTheme } from '../../cirrusTheme';

it('renders correctly', () => {
  let theme = createTheme(cirrusDarkTheme);
  const tree = renderer
    .create(
      <ThemeProvider theme={theme}>
        <WelcomePage />
      </ThemeProvider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
