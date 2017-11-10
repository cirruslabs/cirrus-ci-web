import {formatDuration} from "./time";

export function isTaskFinalStatus(status) {
  switch (status) {
    case "ABORTED":
      return true;
    case "COMPLETED":
      return true;
    case "FAILED":
      return true;
    default:
      return false;
  }
}

export function isTaskCommandFinalStatus(status) {
  switch (status) {
    case "ABORTED":
      return true;
    case "SUCCESS":
      return true;
    case "FAILED":
      return true;
    case "SKIPPED":
      return true;
    default:
      return false;
  }
}

export function taskStatusIconName(status) {
  switch (status) {
    case "CREATED":
      return 'cloud';
    case "SCHEDULED":
      return 'linear_scale';
    case "EXECUTING":
      return 'play_arrow';
    case "COMPLETED":
      return 'done';
    default:
      return 'error';
  }
}

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
}

export function buildStatusMessage(build) {
  switch (build.status) {
    case "CREATED":
      return 'Created';
    case "EXECUTING":
      // since one can re-run some of build's tasks it's not quite clear
      // what is duration for builds like that
      return 'Executing';
    case "COMPLETED":
      return 'Finished in ' + formatDuration(build.durationInSeconds);
    case "FAILED":
      return 'Failed in ' + formatDuration(build.durationInSeconds);
    default:
      return build.status;
  }
}

export function taskStatusMessage(task) {
  switch (task.status) {
    case "CREATED":
      return 'Created';
    case "TRIGGERED":
      return 'Triggered';
    case "SCHEDULED":
      return 'Scheduled';
    case "EXECUTING":
      return 'Executing';
    case "ABORTED":
      return 'Aborted';
    case "COMPLETED":
      return 'Finished in ' + formatDuration(task.durationInSeconds);
    case "FAILED":
      return 'Failed in ' + formatDuration(task.durationInSeconds);
    case "SKIPPED":
      return 'Skipped';
    default:
      return task.status;
  }
}
