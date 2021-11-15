import React from 'react';
import { faApple, faFreebsd, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';
import { SvgIconProps } from '@mui/material';

interface Props extends SvgIconProps {
  platform: string;
}

export default (props: Props) => {
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
