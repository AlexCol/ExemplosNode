import { NomeVO } from '../VOs/NomeVO';
import { BaseEntity } from './base.entity';
import { EmailVO } from '../VOs/EmailVO';
import { IdadeVO } from '../VOs/IdadeVO';

export class Usuario extends BaseEntity {
  id: number;
  nome: NomeVO;
  email: EmailVO;
  idade: IdadeVO;

  //! construtor para quando se tem os objetos já validados
  constructor(id: number, nome: NomeVO, email: EmailVO, idade: IdadeVO) {
    super();
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.idade = idade;
  }

  //! create pra quando se deseja passar um objeto simples e deixar a entidade cuidar da criação dos VOs
  static create(data: {
    id: number;
    nome: string;
    email: string;
    idade: number;
  }): Usuario {
    return new Usuario(
      data.id,
      new NomeVO(data.nome),
      new EmailVO(data.email),
      new IdadeVO(data.idade),
    );
  }

  //! fromJson para desserialização, criando os VOs conforme necessário
  static fromJson(json: Record<string, unknown>): Usuario {
    // Usa o método da BaseEntity com mapeamentos explícitos
    const instance = super.fromJson(json, {
      nome: NomeVO,
      email: EmailVO,
      idade: IdadeVO,
    }) as Usuario;

    return instance;
  }

  //! Mapeamentos automáticos de VOs por convenção
  protected static getAutoVOMappings(): Record<
    string,
    new (value: unknown) => unknown
  > {
    return {
      nome: NomeVO,
      email: EmailVO,
      idade: IdadeVO,
    };
  }
}
