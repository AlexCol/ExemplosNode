import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { PaginationCriteriaDto } from './PaginationCriteriaDto';
import { SortCriteriaDto } from './SortCriteriaDto';
import { WhereCriteriaDto } from './WhereCriteriaDto';

export class SearchCriteriaDto {
  @ApiProperty({ type: [WhereCriteriaDto], required: false, description: 'Array of where criteria. Optional.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Indica que cada item do array deve ser validado
  @Type(() => WhereCriteriaDto) // Define o tipo do objeto
  where?: WhereCriteriaDto[];

  @ApiProperty({ type: PaginationCriteriaDto, required: false, description: 'Pagination criteria. Optional.' })
  @IsOptional()
  @ValidateNested() // Indica que o objeto deve ser validado
  @Type(() => PaginationCriteriaDto) // Define o tipo do objeto
  pagination?: PaginationCriteriaDto;

  @ApiProperty({ type: [SortCriteriaDto], required: false, description: 'Array of sort criteria. Optional.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Indica que cada item do array deve ser validado
  @Type(() => SortCriteriaDto) // Define o tipo do objeto
  sort?: SortCriteriaDto[];
}
