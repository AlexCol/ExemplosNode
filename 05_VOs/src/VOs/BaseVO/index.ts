export abstract class BaseVO {
  abstract getValue(...params: unknown[]): unknown;
}
