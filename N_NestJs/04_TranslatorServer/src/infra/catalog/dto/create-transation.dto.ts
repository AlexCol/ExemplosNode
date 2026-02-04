import { IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
