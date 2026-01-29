import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Lista de mensagens de erro detalhadas',
    example: ['Email inválido.', 'Data/hora inválida.'],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'O tipo do erro',
    example: 'BadRequest',
  })
  error: string;
  0;

  @ApiProperty({
    description: 'Código de status HTTP associado ao erro',
    example: 400,
  })
  statusCode: number;
}
