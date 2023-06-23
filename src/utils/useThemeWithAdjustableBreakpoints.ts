import { useRecoilValue } from 'recoil';

import { cirrusOpenDrawerState } from 'cirrusTheme';

function useThemeWithAdjustableBreakpoints(theme) {
  const isDrawerOpen = useRecoilValue(cirrusOpenDrawerState);

  if (isDrawerOpen) {
    theme = {
      ...theme,
      breakpoints: {
        values: {
          xs: 0,
          sm: 900,
          md: 1200,
          lg: 1600,
          xl: 1800,
        },
      },
    };
  }

  return theme;
}

export default useThemeWithAdjustableBreakpoints;
