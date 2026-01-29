import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';

@Module({
  imports: [],
  controllers: [SearchController],
  providers: [],
})
export class SearchModule { }
