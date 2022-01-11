import React from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import FontAwesomeIcon from './FontAwesomeIcon';
import { SvgIconProps } from '@mui/material';

interface Props extends SvgIconProps {
  platform: string;
}

const OwnerPlatformIcon = (props: Props) => {
  switch (props.platform) {
    case 'github':
      return <FontAwesomeIcon {...props} icon={faGithub} />;
    default:
      return <FontAwesomeIcon {...props} icon={faGithub} />;
  }
};

export default OwnerPlatformIcon;
