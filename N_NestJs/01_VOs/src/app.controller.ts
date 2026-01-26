import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { EmailVO } from './VOs/EmailVO';
import { NomeVO } from './VOs/NomeVO';

@Controller()
export class AppController {
  constructor() { }

  @Post('users')
  newUser(
    @Body() body: UsuarioDto
  ) {
    const usuario = new Usuario(
      body.id,
      body.nome,
      body.email,
      body.idade
    );

    return usuario.toJson();
  }
}
