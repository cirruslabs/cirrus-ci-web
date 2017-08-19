import React from 'react';

export function buildStatusIconName(status) {
  switch (status) {
    case "CREATED":
      return 'cloud';
    case "EXECUTING":
      return 'play_arrow';
    case "COMPLETED":
      return 'done';
    default:
      return 'error';
  }
};
