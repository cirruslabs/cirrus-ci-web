import React from 'react';

import LockCloseIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Tooltip } from '@mui/material';

interface Props {
  enabledForPublic: boolean;
}

export default function PoolVisibilityIcon(props: Props) {
  return props.enabledForPublic ? (
    <Tooltip title="Public Pool">
      <LockOpenIcon />
    </Tooltip>
  ) : (
    <Tooltip title="Private Pool">
      <LockCloseIcon />
    </Tooltip>
  );
}
