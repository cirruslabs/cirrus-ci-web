import {
  blue300,
  blue500,
  darkBlack,
  fullBlack,
  grey50,
  grey100,
  grey300,
  grey400,
  grey500,
  grey900,
  indigo400,
  indigo600,
  lightGreen100,
  lightGreen300,
  lightGreen500,
  orange300,
  orange500,
  pinkA200,
  red300,
  red500,
  white,
  yellow300,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

let successColor = lightGreen500;
let lightSuccessColor = lightGreen300;

let cirrusColors = {
  cirrusPrimary: grey900,
  cirrusDark: grey900,
  cirrusWhite: grey50,
  progress: successColor,
  initialization: blue500,
  lightInitialization: blue300,
  success: successColor,
  lightSuccess: lightSuccessColor,
  warning: orange500,
  lightWarning: orange300,
  failure: red500,
  lightFailure: red300,
  undefined: grey400,
  executing: yellow300,
  skipped: lightGreen100,
  aborted: orange300
};

/**
 *  Fork of lightBaseTheme.js
 */
let cirrusTheme = {
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  borderRadius: 2,
  palette: {
    primary1Color: cirrusColors.cirrusPrimary,
    primary2Color: indigo600,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: fade(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: indigo400,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};

export {
  cirrusColors,
  cirrusTheme
}
