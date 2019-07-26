export function getNodesFromConnection<Node = any>(connection: {
  readonly edges: ReadonlyArray<{ readonly node: Node }>;
}) {
  return connection.edges.map(edge => edge.node);
}
