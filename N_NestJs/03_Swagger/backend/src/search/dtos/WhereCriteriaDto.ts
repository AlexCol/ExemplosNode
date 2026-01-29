import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class WhereCriteriaDto {
  @ApiProperty({ description: 'Field to apply the condition on. Must be one of the response fields.' })
  @IsString()
  field!: string;

  @ApiProperty({
    description: 'Value to compare the field against.',
    type: 'string',
  })
  @IsDefined()
  value: unknown;

  @ApiProperty({
    description: 'Indicates if the condition is negated. Will invert the condition if true.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isNegated?: boolean;

  @ApiProperty({
    description:
      'Indicates if the comparison should use LIKE operator. If true, the comparison will use the LIKE operator.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isLike?: boolean;

  @ApiProperty({ description: 'Operator to use for comparison.', required: false })
  @IsOptional()
  @IsString()
  operator?: string;
}
