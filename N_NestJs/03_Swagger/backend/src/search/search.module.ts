import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [],
  controllers: [SearchController, UsuariosController],
  providers: [],
})
export class SearchModule {}
