export abstract class BaseVO {
  abstract getValue(...params: unknown[]): unknown;
  static create(value: unknown): BaseVO {
    throw new Error("Not implemented");
  }
}
