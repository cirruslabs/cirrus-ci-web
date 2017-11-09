import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {cirrusColors} from './../cirrusTheme'

const CirrusCircularProgress = (props) => {
  return <CircularProgress color={cirrusColors.progress} {...props}/>
};

export default CirrusCircularProgress
