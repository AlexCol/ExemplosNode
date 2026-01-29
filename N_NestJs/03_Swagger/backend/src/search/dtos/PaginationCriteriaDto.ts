import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PaginationCriteriaDto {
  @ApiProperty({ description: 'Número da página, começando em 1.' })
  @IsNumber()
  @Min(1)
  page!: number;

  @ApiProperty({ description: 'Número de itens por página.' })
  @IsNumber()
  @Min(1)
  limit!: number;
}
