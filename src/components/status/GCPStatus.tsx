import { IconButton, Tooltip, useTheme } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import { selector, useRecoilValue } from 'recoil';
import React from 'react';

export const GCPHasOngoingIncident = selector({
  key: 'GCPHasOngoingIncident',
  get: async () => {
    try {
      const incidentsResponse = await fetch('https://status.cloud.google.com/incidents.json');
      const body = await incidentsResponse.json();
      return !body[0].end;
    } catch (e) {
      // status page is offline or blocked, doesn't mean GCP is down
      return false;
    }
  },
});

const GCPStatus = () => {
  let theme = useTheme();
  let hasIncident = useRecoilValue(GCPHasOngoingIncident);

  if (!hasIncident) return <div />;

  return (
    <Tooltip title="Google Cloud has an ongoing incident that can affect normal operations">
      <IconButton href="https://status.cloud.google.com/" target="_blank" rel="noopener noreferrer" size="large">
        <CloudIcon style={{ color: theme.palette.error.dark }} />
      </IconButton>
    </Tooltip>
  );
};

export default GCPStatus;
