import { ApiProperty } from '@nestjs/swagger';

export class OutroDto {
  @ApiProperty({
    example: '12345',
  })
  id: string;

  @ApiProperty({
    example: 'Nome Exemplo',
  })
  nome: string;

  @ApiProperty({
    example: 30,
  })
  idade: number;
}
