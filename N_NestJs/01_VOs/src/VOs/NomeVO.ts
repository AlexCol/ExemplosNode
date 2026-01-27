import { BaseVO } from './_BaseVO';
import InvalidValueObjectError from './_InvalidValueObjectError';

export class NomeVO extends BaseVO {
  private readonly nome: string;

  constructor(nome: string) {
    super();
    this.nome = nome.trim();
    this.validate();
  }

  validate(): void {
    if (!this.nome || this.nome.trim().length === 0) {
      throw new InvalidValueObjectError('nome', 'Nome não pode ser vazio.');
    }
  }

  getValue(): string {
    return this.nome;
  }

  toString(): string {
    return this.nome;
  }

  // equals(other: NomeVO): boolean {
  //   return this.nome === other.getValue();
  // }
}
