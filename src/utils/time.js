export function formatDuration(durationInSeconds) {
  let formatSinglePart = (value) => value < 10 ? "0" + value : value.toString();
  let secondsTotal = durationInSeconds || 0;
  let seconds = Math.floor(secondsTotal % 60);
  let minutes = Math.floor(secondsTotal / 60);
  let hours = Math.floor(minutes / 60);
  if (hours === 0) {
    return formatSinglePart(minutes) + ":" + formatSinglePart(seconds)
  }
  return formatSinglePart(hours) + ":" + formatSinglePart(minutes) + ":" + formatSinglePart(seconds)
}
