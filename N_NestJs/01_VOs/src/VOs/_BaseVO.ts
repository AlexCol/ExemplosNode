export abstract class BaseVO {
  abstract validate(): void;
  abstract getValue(): unknown;

  toString(): string {
    return String(this.getValue());
  }

  equals(other: BaseVO): boolean {
    if (!other) {
      return false;
    }
    return this.getValue() === other.getValue();
  }
}