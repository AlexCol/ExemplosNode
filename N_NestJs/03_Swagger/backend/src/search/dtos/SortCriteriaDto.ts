import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsIn, IsString } from 'class-validator';

export class SortCriteriaDto {
  @ApiProperty({ description: 'Campo para ordenar. Deve ser um dos campos da entidade retornada.' })
  @IsString()
  field!: string;

  @ApiProperty({ description: 'Ordem de ordenação, ascendente ou descendente. Deve ser "asc" ou "desc".' })
  @IsIn(['asc', 'desc'])
  order!: 'asc' | 'desc';
}
