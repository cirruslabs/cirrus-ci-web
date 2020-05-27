import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import lightGreen from '@material-ui/core/colors/lightGreen';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

let darkSuccessColor = lightGreen['700'];
let successColor = lightGreen['500'];
let lightSuccessColor = lightGreen['300'];

export let cirrusColors = {
  cirrusGrey: grey['300'],
  cirrusWhite: grey['50'],
  progress: successColor,
  initialization: blue['500'],
  lightInitialization: blue['300'],
  success: successColor,
  lightSuccess: lightSuccessColor,
  darkSuccess: darkSuccessColor,
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

/*
 *  Fork of lightBaseTheme.js
 */
export let cirrusTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 2,
  },
  palette: {
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
