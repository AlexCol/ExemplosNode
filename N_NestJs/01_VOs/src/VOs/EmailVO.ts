import { BaseVO } from './_BaseVO';
import InvalidValueObjectError from './_InvalidValueObjectError';

export class EmailVO extends BaseVO {
  private readonly email: string;

  constructor(email: string) {
    super();
    this.email = email.trim();
    this.validate();
  }

  validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !emailRegex.test(this.email)) {
      throw new InvalidValueObjectError('email', 'Email inválido.');
    }
  }

  getValue(): string {
    return this.email;
  }

  toString(): string {
    return this.email;
  }

  // equals(other: EmailVO): boolean {
  //   return this.email === other.getValue();
  // }
}
