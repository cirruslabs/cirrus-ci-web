export const copyToClipboard = element => {
  element.select();
  document.execCommand('copy');
};
