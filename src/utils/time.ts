import pluralize from 'pluralize';

export function formatDuration(durationInSeconds: number) {
  if (durationInSeconds >= 24 * 60 * 60) {
    let hours = durationInSeconds / 60 / 60;
    return Math.round(hours) + 'h';
  }

  let formatSinglePart = value => (value < 10 ? '0' + value : value.toString());
  let duration = Math.max(0, durationInSeconds || 0);
  let seconds = Math.floor(duration % 60);
  duration /= 60;
  let minutes = Math.floor(duration % 60);
  duration /= 60;
  let hours = Math.floor(duration % 60);
  if (hours === 0) {
    return formatSinglePart(minutes) + ':' + formatSinglePart(seconds);
  }
  return formatSinglePart(hours) + ':' + formatSinglePart(minutes) + ':' + formatSinglePart(seconds);
}

export function roundAndPresentDuration(durationInSeconds) {
  durationInSeconds = Math.max(0, durationInSeconds || 0);
  if (durationInSeconds < 60) {
    return pluralize('second', Math.floor(durationInSeconds), true);
  }
  let durationInMinutes = durationInSeconds / 60;
  if (durationInMinutes < 60) {
    return pluralize('minute', Math.floor(durationInMinutes), true);
  }
  let durationInHours = durationInMinutes / 60;
  if (durationInHours < 24) {
    return pluralize('hour', Math.floor(durationInHours), true);
  }
  let durationInDays = durationInHours / 24;
  if (durationInDays < 7) {
    return pluralize('day', Math.floor(durationInDays), true);
  }
  let durationInWeeks = durationInDays / 7;
  return pluralize('week', Math.floor(durationInWeeks), true);
}
