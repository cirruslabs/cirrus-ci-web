import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import {cirrusColors} from './../cirrusTheme'

const CirrusLinearProgress = () => {
  return <LinearProgress mode="indeterminate" color={cirrusColors.progress}/>
};

export default CirrusLinearProgress
