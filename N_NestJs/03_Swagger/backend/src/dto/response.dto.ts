import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    example: '12345',
  })
  id: string;
  
  @ApiProperty({
    example: '1500.75',
  })
  grana: string;

  @ApiProperty({
    example: 'usuario@email.com',
  })
  email: string;

  @ApiProperty({
    example: '2024-08-15T14:30:00:000Z',
  })
  dataHora: string;
}
