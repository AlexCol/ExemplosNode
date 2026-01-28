export default class InvalidValueObjectError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "InvalidValueObjectError";
  }
}
