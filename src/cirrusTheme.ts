import { ThemeOptions } from '@mui/material/styles';
import { atom, selector } from 'recoil';
import { localStorageEffect } from './utils/recoil';

import { grey, lightGreen, orange, red } from '@mui/material/colors';

export const prefersDarkModeState = atom({
  key: 'CurrentlyPrefersDarkMode',
  default: false,
  effects_UNSTABLE: [localStorageEffect('CurrentlyPreferredTheme')],
});

export const muiThemeOptions = selector({
  key: 'muiThemeOptions',
  get: ({ get }) => {
    const prefersDarkMode = get(prefersDarkModeState);
    return prefersDarkMode ? muiDarkTheme : muiLightTheme;
  },
});

export const cirrusColorsState = selector({
  key: 'cirrusColorsState',
  get: ({ get }) => {
    const prefersDarkMode = get(prefersDarkModeState);
    return {
      undefined: prefersDarkMode ? grey['600'] : grey['400'],
    };
  },
});

export const cirrusThemeOptions = selector({
  key: 'cirrusThemeOptions',
  get: ({ get }) => {
    const prefersDarkMode = get(prefersDarkModeState);
    return prefersDarkMode ? cirrusDarkTheme : cirrusLightTheme;
  },
});

let cirrusBaseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 2,
  },
};

export let cirrusLightTheme: ThemeOptions = {
  ...cirrusBaseTheme,
  palette: {
    mode: 'light',
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
    success: {
      light: lightGreen['300'],
      main: lightGreen['500'],
      dark: lightGreen['700'],
    },
    error: {
      light: red['300'],
      main: red['500'],
      dark: red['700'],
    },
    warning: {
      light: orange['300'],
      main: orange['500'],
      dark: orange['700'],
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        avatar: {
          marginLeft: 0,
          marginRight: 0,
          height: 32,
          width: 32,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          padding: 6, // it was changed from v4
        },
      },
    },
  },
};

export let cirrusDarkTheme: ThemeOptions = {
  ...cirrusBaseTheme,
  palette: {
    mode: 'dark',
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
    success: {
      light: lightGreen['400'],
      main: lightGreen['600'],
      dark: lightGreen['800'],
    },
    error: {
      light: red['400'],
      main: red['600'],
      dark: red['800'],
    },
    warning: {
      light: orange['400'],
      main: orange['600'],
      dark: orange['800'],
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        avatar: {
          marginLeft: 0,
          marginRight: 0,
          height: 32,
          width: 32,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          padding: 6, // it was changed from v4
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: grey['50'],
          },
        },
      },
    },
  },
};

export let muiLightTheme: ThemeOptions = {
  palette: cirrusLightTheme.palette,
};

export let muiDarkTheme: ThemeOptions = {
  palette: cirrusDarkTheme.palette,
};
