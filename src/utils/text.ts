export function shorten(text, maxLength = 40) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substr(0, maxLength) + '...';
  }
}
