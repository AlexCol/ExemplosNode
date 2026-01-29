import { IsNumber, IsOptional } from 'class-validator';
import { isVO } from 'src/decorators/isVO';
import { DataHoraVO } from 'src/VOs/DataVO/DataHoraVO';
import { EmailVO } from 'src/VOs/EmailVO/EmailVO';
import { MonetarioVO } from 'src/VOs/MonetarioVO/MonetarioVO';

export class ExemploDto {
  @IsOptional()
  @IsNumber()
  id: number;

  //@IsOptional()
  @isVO(EmailVO)
  email: EmailVO;

  //@IsOptional()
  @isVO(MonetarioVO)
  grana: MonetarioVO;

  //@IsOptional()
  @isVO(DataHoraVO)
  dataHora: DataHoraVO;
}
