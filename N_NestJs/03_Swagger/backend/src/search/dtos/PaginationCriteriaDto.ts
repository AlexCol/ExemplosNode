import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class PaginationCriteriaDto {
  @ApiProperty({ description: 'Page number, starting from 1.' })
  @IsNumber()
  @Min(1)
  page!: number;

  @ApiProperty({ description: 'Number of items per page.' })
  @IsNumber()
  @Min(1)
  limit!: number;
}
