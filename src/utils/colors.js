import {cirrusColors} from './../cirrusTheme'

export function buildStatusColor(status) {
  switch (status) {
    case "CREATED":
      return cirrusColors.initialization;
    case "EXECUTING":
      return cirrusColors.lightSuccess;
    case "COMPLETED":
      return cirrusColors.success;
    case "FAILED":
      return cirrusColors.failure;
    default:
      return cirrusColors.warning;
  }
}

export function taskStatusColor(status) {
  switch (status) {
    case "CREATED":
      return cirrusColors.lightInitialization;
    case "SCHEDULED":
      return cirrusColors.initialization;
    case "EXECUTING":
      return cirrusColors.lightSuccess;
    case "COMPLETED":
      return cirrusColors.success;
    case "ABORTED":
      return cirrusColors.lightFailure;
    case "FAILED":
      return cirrusColors.failure;
    default:
      return cirrusColors.undefined;
  }
}

export function faviconColor(status) {
  switch (status) {
    case "COMPLETED":
      return cirrusColors.darkSuccess;
    case "ABORTED":
      return cirrusColors.failure;
    case "FAILED":
      return cirrusColors.failure;
    default:
      return cirrusColors.warning;
  }
}

export function commandStatusColor(status) {
  switch (status) {
    case 'SUCCESS':
      return cirrusColors.lightSuccess;
    case 'EXECUTING':
      return cirrusColors.executing;
    case 'FAILURE':
      return cirrusColors.lightFailure;
    case 'ABORTED':
      return cirrusColors.aborted;
    case 'SKIPPED':
      return cirrusColors.skipped;
    default:
      return cirrusColors.undefined;
  }
}

export function notificationColor(level) {
  switch (level) {
    case 'INFO':
      return cirrusColors.success;
    case 'ERROR':
      return cirrusColors.failure;
    default:
      return cirrusColors.warning;
  }
}
