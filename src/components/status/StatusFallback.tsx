import React from 'react';

import { Skeleton, useTheme } from '@mui/material';

export default function StatusFallback() {
  let theme = useTheme();

  return (
    <Skeleton
      variant={'circular'}
      width={theme.spacing(3)}
      height={theme.spacing(3)}
      sx={{ margin: theme.spacing(1.5) }}
    />
  );
}
