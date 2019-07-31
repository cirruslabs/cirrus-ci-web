/**
 * inspired by https://stackoverflow.com/questions/43537520/how-do-i-extract-a-type-from-an-array-in-typescript
 * This utility type extracts the Node type from a relay Connection type that has been auto-generated by relay-graphql-typescript.
 */
export type NodeOfConnection<ConnectionType> = ConnectionType extends {
  readonly edges: ReadonlyArray<{
    readonly node: infer Node | null;
  } | null> | null;
} | null
  ? Node
  : unknown;

export type ItemOfArray<ArrayType> = ArrayType extends ReadonlyArray<infer Item> ? Item : unknown;

export interface UnspecifiedCallbackFunction {
  (...args: any[]): any;
}
