import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { PaginationCriteriaDto } from './PaginationCriteriaDto';
import { SortCriteriaDto } from './SortCriteriaDto';
import { WhereCriteriaDto } from './WhereCriteriaDto';

export class SearchCriteriaDto {
  @ApiProperty({ type: [WhereCriteriaDto], required: false, description: 'Array de critérios de filtro. Opcional.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Indica que cada item do array deve ser validado
  @Type(() => WhereCriteriaDto) // Define o tipo do objeto
  where?: WhereCriteriaDto[];

  @ApiProperty({ type: PaginationCriteriaDto, required: false, description: 'Critérios de paginação. Opcional.' })
  @IsOptional()
  @ValidateNested() // Indica que o objeto deve ser validado
  @Type(() => PaginationCriteriaDto) // Define o tipo do objeto
  pagination?: PaginationCriteriaDto;

  @ApiProperty({ type: [SortCriteriaDto], required: false, description: 'Array de critérios de ordenação. Opcional.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Indica que cada item do array deve ser validado
  @Type(() => SortCriteriaDto) // Define o tipo do objeto
  sort?: SortCriteriaDto[];
}
