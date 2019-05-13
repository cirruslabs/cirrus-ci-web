import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import lightGreen from '@material-ui/core/colors/lightGreen';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';

let darkSuccessColor = lightGreen['700'];
let successColor = lightGreen['500'];
let lightSuccessColor = lightGreen['300'];

let cirrusColors = {
  cirrusPrimary: grey['900'],
  cirrusSecondary: grey['700'],
  cirrusDark: grey['900'],
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

/**
 *  Fork of lightBaseTheme.js
 */
let cirrusTheme = {
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary: {
      main: cirrusColors.cirrusPrimary,
      dark: cirrusColors.cirrusPrimary,
      light: cirrusColors.cirrusWhite,
      contrastText: cirrusColors.cirrusWhite,
    },
    secondary: {
      main: cirrusColors.cirrusSecondary,
      dark: cirrusColors.cirrusSecondary,
      light: cirrusColors.cirrusWhite,
      contrastText: cirrusColors.cirrusWhite,
    },
    action: {
      hover: cirrusColors.cirrusGrey,
    }
  },
  overrides: {
    MuiChip: {
      avatarChildren: {
        // workaround to fix size of avatar icons in production builds
        width: "1em",
        height: "1em",
      },
    },
  },
};

export {
  cirrusColors,
  cirrusTheme
}
