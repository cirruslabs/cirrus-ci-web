import React from 'react';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import {buildStatusColor} from "../../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../../utils/status";

export default function (props) {
  let build = props.build;
  return (
    <Chip style={props.style}>
      <Avatar backgroundColor={buildStatusColor(build.status)}
              icon={<FontIcon className="material-icons">{buildStatusIconName(build.status)}</FontIcon>}/>
      {buildStatusMessage(build)}
    </Chip>
  );
}
