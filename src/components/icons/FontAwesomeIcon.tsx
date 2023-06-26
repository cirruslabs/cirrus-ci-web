import React from 'react';

import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { SvgIcon, SvgIconProps } from '@mui/material';

interface Props extends SvgIconProps {
  icon: IconDefinition;
}

const FontAwesomeIcon = (props: Props) => {
  return (
    <SvgIcon {...props} viewBox={`0 0 ${props.icon.icon[0]} ${props.icon.icon[1]}`}>
      <path d={props.icon.icon[4].toString()} />
    </SvgIcon>
  );
};

export default FontAwesomeIcon;
