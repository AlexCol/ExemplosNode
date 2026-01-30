import { ApiProperty } from '@nestjs/swagger';

export class PaginatedReturn<T> {
  @ApiProperty({ description: 'Array de dados retornados pela busca.', isArray: true })
  data: T[];

  @ApiProperty({ description: 'Total de registros disponíveis.', example: 100 })
  total?: number;

  @ApiProperty({ description: 'Número da página atual.', example: 1 })
  page?: number;

  @ApiProperty({ description: 'Número máximo de registros por página.', example: 10 })
  limit?: number;
}
