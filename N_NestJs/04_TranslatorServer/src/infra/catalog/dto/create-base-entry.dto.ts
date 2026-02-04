import { IsString } from 'class-validator';

export class CreateBaseEntryDto {
  @IsString()
  key: string;
}
