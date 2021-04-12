import { formatDuration } from './time';

export function isTaskFinalStatus(status) {
  switch (status) {
    case 'ABORTED':
      return true;
    case 'COMPLETED':
      return true;
    case 'FAILED':
      return true;
    case 'SKIPPED':
      return true;
    default:
      return false;
  }
}

export function isBuildFinalStatus(status) {
  switch (status) {
    case 'ABORTED':
    case 'ERRORED':
    case 'COMPLETED':
    case 'FAILED':
      return true;
    default:
      return false;
  }
}

export function isTaskExecuting(status) {
  return status === 'EXECUTING';
}

export function isTaskInProgressStatus(status) {
  switch (status) {
    case 'SCHEDULED':
      return true;
    case 'EXECUTING':
      return true;
    default:
      return false;
  }
}

export function isTaskCommandExecuting(status) {
  return status === 'EXECUTING';
}

export function isTaskCommandFinalStatus(status) {
  switch (status) {
    case 'ABORTED':
      return true;
    case 'SUCCESS':
      return true;
    case 'FAILURE':
      return true;
    case 'SKIPPED':
      return true;
    default:
      return false;
  }
}

export function taskStatusIconName(status) {
  switch (status) {
    case 'CREATED':
      return 'cloud';
    case 'SCHEDULED':
      return 'linear_scale';
    case 'EXECUTING':
      return 'play_arrow';
    case 'COMPLETED':
      return 'done';
    case 'SKIPPED':
      return 'done';
    case 'PAUSED':
      return 'pause';
    default:
      return 'error_outlined';
  }
}

export function buildStatusIconName(status) {
  switch (status) {
    case 'CREATED':
      return 'cloud';
    case 'EXECUTING':
      return 'play_arrow';
    case 'COMPLETED':
      return 'done';
    default:
      return 'error_outlined';
  }
}

export function buildStatusMessage(status, durationInSeconds) {
  switch (status) {
    case 'CREATED':
      return 'Created';
    case 'EXECUTING':
      // since one can re-run some of build's tasks it's not quite clear
      // what is duration for builds like that
      return 'Executing';
    case 'ERRORED':
      return 'Errored';
    case 'COMPLETED':
      return 'Finished in ' + formatDuration(durationInSeconds);
    case 'FAILED':
      return 'Failed in ' + formatDuration(durationInSeconds);
    default:
      return status;
  }
}

export function taskStatusMessage(task) {
  switch (task.status) {
    case 'CREATED':
      return 'Created';
    case 'TRIGGERED':
      return 'Triggered';
    case 'SCHEDULED':
      return 'Scheduled';
    case 'EXECUTING':
      return 'Executing';
    case 'ABORTED':
      return 'Aborted in ' + formatDuration(task.durationInSeconds);
    case 'COMPLETED':
      return 'Finished in ' + formatDuration(task.durationInSeconds);
    case 'FAILED':
      return 'Failed in ' + formatDuration(task.durationInSeconds);
    case 'SKIPPED':
      return 'Skipped';
    default:
      return task.status;
  }
}

export function hookIconName(hook) {
  return hook.info.error === '' ? 'done' : 'error_outlined';
}

export function hookStatusMessage(hook) {
  const nanosecondsInMillisecond = 1_000_000;
  const durationMillis = Math.round(hook.info.durationNanos / nanosecondsInMillisecond);
  const humanizedDuration = durationMillis < 1 ? '<1 ms.' : durationMillis + ' ms.';

  const verb = hook.info.error === '' ? 'Finished' : 'Failed';

  return verb + ' in ' + humanizedDuration;
}
