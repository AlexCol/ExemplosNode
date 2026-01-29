import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsIn, IsString } from 'class-validator';

export class SortCriteriaDto {
  @ApiProperty({ description: 'Field to sort by. Must be one of the response fields.' })
  @IsString()
  field!: string;

  @ApiProperty({ description: 'Sort order, either ascending or descending. Must be either "asc" or "desc".' })
  @IsIn(['asc', 'desc'])
  order!: 'asc' | 'desc';
}
