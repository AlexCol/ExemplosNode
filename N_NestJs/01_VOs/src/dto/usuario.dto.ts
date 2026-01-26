import { IsDefined, IsNumber, IsOptional } from "class-validator";
import { isVO } from "../decorators/isVO";
import { EmailVO } from "../VOs/EmailVO";
import { IdadeVO } from "../VOs/IdadeVO";
import { NomeVO } from "../VOs/NomeVO";

export class UsuarioDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @isVO(NomeVO)
  nome: NomeVO;

  @isVO(EmailVO)
  email: EmailVO;

  @isVO(IdadeVO)
  idade: IdadeVO;
}