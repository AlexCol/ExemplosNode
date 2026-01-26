import { NomeVO } from "src/VOs/NomeVO";
import { BaseEntity } from "./base.entity";
import { EmailVO } from "src/VOs/EmailVO";
import { IdadeVO } from "src/VOs/IdadeVO";

export class Usuario extends BaseEntity {
  id: number;
  nome: NomeVO;
  email: EmailVO;
  idade: IdadeVO;

  constructor(
    id: number,
    nome: NomeVO,
    email: EmailVO,
    idade: IdadeVO
  ) {
    super();
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.idade = idade;
  }
}