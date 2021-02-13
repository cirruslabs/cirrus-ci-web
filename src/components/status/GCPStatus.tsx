import { IconButton, Tooltip, useTheme } from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import { atom, useRecoilValue } from 'recoil';
import React from 'react';

export const GCPHasOngoingIncident = atom({
  key: 'GCPHasOngoingIncident',
  default: async () => {
    const incidentsResponse = await fetch('https://status.cloud.google.com/incidents.json');
    const body = await incidentsResponse.json();
    if (body[0].end) {
      // there is an incident which ended
      return false;
    }
    return true;
  },
});

export default () => {
  let theme = useTheme();
  let hasIncident = useRecoilValue(GCPHasOngoingIncident);

  if (!hasIncident) return null;

  return (
    <Tooltip title="Google Cloud has an ongoing incident that can affect normal operations">
      <IconButton href="https://status.cloud.google.com/" target="_blank" rel="noopener noreferrer">
        <CloudIcon style={{ color: theme.palette.error.dark }} />
      </IconButton>
    </Tooltip>
  );
};
