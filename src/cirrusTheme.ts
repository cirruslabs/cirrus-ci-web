import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import lightGreen from '@material-ui/core/colors/lightGreen';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { atom, selector } from 'recoil';
import { localStorageEffect } from './utils/recoil';

export const prefersDarkModeState = atom({
  key: 'CurrentlyPrefersDarkMode',
  default: false,
  effects_UNSTABLE: [localStorageEffect('CurrentlyPreferredTheme')],
});

let cirrusBaseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 2,
  },
  overrides: {
    MuiChip: {
      root: {
        '& $avatar': {
          marginLeft: 0,
          marginRight: 0,
          width: 32,
          height: 32,
        },
      },
    },
  },
};

export let cirrusLightTheme: ThemeOptions = {
  ...cirrusBaseTheme,
  palette: {
    type: 'light',
    primary: {
      main: grey['900'],
      dark: grey['900'],
      light: grey['50'],
      contrastText: grey['50'],
    },
    secondary: {
      main: grey['700'],
      dark: grey['700'],
      light: grey['50'],
      contrastText: grey['50'],
    },
    action: {
      hover: grey['200'],
    },
  },
};

export let cirrusDarkTheme: ThemeOptions = {
  ...cirrusBaseTheme,
  palette: {
    type: 'dark',
  },
};

export const cirrusColorsState = selector({
  key: 'cirrusColorsState',
  get: ({ get }) => {
    const prefersDarkMode = get(prefersDarkModeState);
    return prefersDarkMode ? cirrusColors : cirrusColors;
  },
});

let cirrusColors = {
  progress: lightGreen['500'],
  initialization: blue['500'],
  lightInitialization: blue['300'],
  success: lightGreen['500'],
  lightSuccess: lightGreen['300'],
  darkSuccess: lightGreen['700'],
  warning: orange['500'],
  lightWarning: orange['300'],
  failure: red['500'],
  lightFailure: red['300'],
  undefined: grey['400'],
  executing: yellow['700'],
  paused: yellow['500'],
  skipped: lightGreen['100'],
  aborted: orange['300'],
};
