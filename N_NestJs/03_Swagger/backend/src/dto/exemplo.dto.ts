import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { isVO } from 'src/decorators/isVO';
import { DataHoraVO } from 'src/VOs/DataVO/DataHoraVO';
import { EmailVO } from 'src/VOs/EmailVO/EmailVO';
import { MonetarioVO } from 'src/VOs/MonetarioVO/MonetarioVO';

export class ExemploDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'O email do usuário',
    example: 'joao@example.com',
    type: String, // Define explicitamente o tipo como string
  })
  //@IsOptional()
  @isVO(EmailVO)
  email: EmailVO;

  @ApiProperty({
    description:
      'O saldo monetário do usuário. Somente numeros, separado por .',
    example: '1500.75',
    type: String, // Define explicitamente o tipo como string
  })
  //@IsOptional()
  @isVO(MonetarioVO)
  grana: MonetarioVO;

  @ApiProperty({
    description: 'A data e hora do evento em ISO 8601',
    example: '2024-08-15T14:30:00Z',
    type: String, // Define explicitamente o tipo como string
  })
  //@IsOptional()
  @isVO(DataHoraVO)
  dataHora: DataHoraVO;
}
