export function getNodesFromConnection<Node = any>(connection: {
  readonly edges: ReadonlyArray<{ readonly node: Node }>;
}) {
  return connection.edges.map(edge => edge.node);
}

export function shorten(text, maxLength = 40) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substr(0, maxLength) + '...';
  }
}

export function hasWritePermissions(permission) {
  return permission === 'WRITE' || permission === 'ADMIN';
}

export function createLinkToRepository(repository: { owner: string; name: string }, branch?: string): string {
  return `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}${
    branch ? `/tree/${encodeURIComponent(branch)}` : ''
  }`;
}
