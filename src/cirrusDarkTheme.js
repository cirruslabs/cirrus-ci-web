import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import lightGreen from '@material-ui/core/colors/lightGreen';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import cirrusColors from './cirrusTheme.js';
let darkSuccessColor = lightGreen['700'];
let successColor = lightGreen['500'];
let lightSuccessColor = lightGreen['300'];

/**
 *  Fork of lightBaseTheme.js
 */
let cirrusDarkTheme = {
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  typography: {
    useNextVariants: true,
    fontSize: 14,
  },
  palette: {
    primary: {
      main: cirrusColors.cirrusPrimary,
      dark: cirrusColors.cirrusPrimary,
      light: cirrusColors.cirrusWhite,
      contrastText: cirrusColors.cirrusWhite,
    },
    secondary: {
      main: cirrusColors.cirrusSecondary,
      light: cirrusColors.cirrusSecondary,
      dark: cirrusColors.cirrusWhite,
      contrastText: cirrusColors.cirrusWhite,
    },
    action: {
      hover: cirrusColors.cirrusSecondary,
    }
  },
};

export {
  cirrusColors,
  cirrusDarkTheme
}
