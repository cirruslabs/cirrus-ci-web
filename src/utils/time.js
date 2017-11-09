export function formatDuration(durationInSeconds) {
  let formatSinglePart = (value) => value < 10 ? "0" + value : value.toString();
  let duration = durationInSeconds || 0;
  let seconds = Math.floor(duration % 60);
  duration /= 60;
  let minutes = Math.floor(duration % 60);
  duration /= 60;
  let hours = Math.floor(duration % 60);
  if (hours === 0) {
    return formatSinglePart(minutes) + ":" + formatSinglePart(seconds)
  }
  return formatSinglePart(hours) + ":" + formatSinglePart(minutes) + ":" + formatSinglePart(seconds)
}
