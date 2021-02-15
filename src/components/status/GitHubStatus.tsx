import { IconButton, Tooltip, useTheme } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { selector, useRecoilValue } from 'recoil';
import React from 'react';

export const GitHubStatusIndicatorState = selector({
  key: 'GitHubStatusIndicator',
  get: async () => {
    try {
      const incidentsResponse = await fetch('https://kctbh9vrtdwd.statuspage.io/api/v2/status.json');
      const body = await incidentsResponse.json();
      return body.status.indicator;
    } catch (e) {
      // statuspage being down or failed connection doesn't mean GitHub is down
      return 'none';
    }
  },
});

export default () => {
  let theme = useTheme();
  let indicator = useRecoilValue(GitHubStatusIndicatorState);

  if (indicator === 'none') return <div />;

  return (
    <Tooltip title={`GitHub has an ongoing ${indicator} incident that can affect normal operations`}>
      <IconButton href="https://www.githubstatus.com/" target="_blank" rel="noopener noreferrer">
        <ErrorIcon style={{ color: theme.palette.error.dark }} />
      </IconButton>
    </Tooltip>
  );
};
