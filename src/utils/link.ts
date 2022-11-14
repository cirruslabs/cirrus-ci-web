export function absoluteLink(...slugs: Array<string>): string {
  return '/' + slugs.map(encodeURIComponent).join('/');
}
