import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';
import lightGreen from 'material-ui/colors/lightGreen';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import yellow from 'material-ui/colors/yellow';

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
  warning: orange['500'],
  lightWarning: orange['300'],
  failure: red['500'],
  lightFailure: red['300'],
  undefined: grey['400'],
  executing: yellow['300'],
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
      hover: cirrusColors.cirrusSecondary,
    }
  },
};

export {
  cirrusColors,
  cirrusTheme
}
