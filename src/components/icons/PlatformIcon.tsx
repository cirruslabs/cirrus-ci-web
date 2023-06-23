import React from 'react';

import { faApple, faFreebsd, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';

import { SvgIconProps } from '@mui/material';

import FontAwesomeIcon from './FontAwesomeIcon';

interface Props extends SvgIconProps {
  platform: string;
}

const PlatformIcon = (props: Props) => {
  switch (props.platform) {
    case 'darwin':
      return <FontAwesomeIcon {...props} icon={faApple} />;
    case 'windows':
      return <FontAwesomeIcon {...props} icon={faWindows} />;
    case 'freebsd':
      return <FontAwesomeIcon {...props} icon={faFreebsd} />;
    default:
      return <FontAwesomeIcon {...props} icon={faLinux} />;
  }
};

export default PlatformIcon;
