import { BaseVO } from "./_BaseVO";
import InvalidValueObjectError from "./_InvalidValueObjectError.js";

export class IdadeVO extends BaseVO {
  private readonly idade: number;
  constructor(idade: number) {
    super();
    this.idade = idade;
    this.validate();
  }

  validate(): void {
    if (!Number.isInteger(this.idade) || this.idade < 0 || this.idade > 120) {
      throw new InvalidValueObjectError(
        'idade',
        'Idade inválida. Deve ser um número inteiro entre 0 e 120.'
      );
    }
  }

  getValue(): number {
    return this.idade;
  }
  toString(): string {
    return this.idade.toString();
  }
  // equals(other: IdadeVO): boolean {
  //   return this.idade === other.getValue();
  // }
}
