import React from 'react';
import { Tooltip } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockCloseIcon from '@mui/icons-material/Lock';

interface Props {
  enabledForPublic: boolean;
}

export default (props: Props) =>
  props.enabledForPublic ? (
    <Tooltip title="Public Pool">
      <LockOpenIcon />
    </Tooltip>
  ) : (
    <Tooltip title="Private Pool">
      <LockCloseIcon />
    </Tooltip>
  );
