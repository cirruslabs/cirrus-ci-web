import React from 'react';
import {Tooltip} from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockCloseIcon from "@material-ui/icons/Lock";

interface Props {
  enabledForPublic: boolean;
}

export default (props: Props) =>
  props.enabledForPublic ?
    <Tooltip title="Public Pool">
      <LockOpenIcon/>
    </Tooltip>
    :
    <Tooltip title="Private Pool">
      <LockCloseIcon/>
    </Tooltip>;

