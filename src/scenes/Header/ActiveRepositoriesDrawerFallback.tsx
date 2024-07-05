import React from 'react';

import { Skeleton, useTheme } from '@mui/material';

export default function ActiveRepositoriesFallback() {
  let theme = useTheme();

  return (
    <Skeleton
      variant={'circular'}
      width={theme.spacing(5)}
      height={theme.spacing(5)}
      sx={{ margin: theme.spacing(1.5) }}
    />
  );
}
