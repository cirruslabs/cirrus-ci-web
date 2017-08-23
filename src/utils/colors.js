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
      return cirrusColors.failure;
    case "FAILED":
      return cirrusColors.failure;
    default:
      return cirrusColors.undefined;
  }
}

export function commandStatusColor(status) {
  switch (status) {
    case 'SUCCESS':
      return cirrusColors.lightSuccess;
    case 'FAILURE':
      return cirrusColors.lightFailure;
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
