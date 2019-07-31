export function repoToLink(repository: { owner: string; name: string }, branch?: string): string {
  return `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}${
    branch ? `/tree/${encodeURIComponent(branch)}` : ''
  }`;
}
