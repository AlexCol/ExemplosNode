import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class WhereCriteriaDto {
  @ApiProperty({ description: 'Campo para aplicar a condição. Deve ser um dos campos da entidade retornada.' })
  @IsString()
  field!: string;

  @ApiProperty({
    description: 'Valor para comparar o campo.',
    type: 'string',
  })
  @IsDefined()
  value: unknown;

  @ApiProperty({
    description: 'Indica se a condição é negada. Inverterá a condição se verdadeiro.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isNegated?: boolean;

  @ApiProperty({
    description: 'Indica se a comparação deve usar o operador LIKE. Se verdadeiro, a comparação usará o operador LIKE.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isLike?: boolean;

  @ApiProperty({
    description:
      'Operador a ser usado para comparação. Valores válidos: "=", "!=", ">", "<", ">=", "<=", "<>". Se não enviado, considera "=" como padrão.',
    required: false,
  })
  @IsOptional()
  @IsString()
  operator?: string;
}
