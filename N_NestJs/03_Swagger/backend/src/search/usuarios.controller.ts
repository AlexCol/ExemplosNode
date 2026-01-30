import { Controller, Get, Param } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiDoc } from './decorators/ApiDoc';

export class Usuario {
  @ApiProperty({ description: 'Nome do usuário' })
  nome: string;
}

@Controller()
export class UsuariosController {
  constructor() {}

  @Get(':nome')
  @ApiDoc({
    summary: 'Busca de usuários',
    params: [{ name: 'nome', type: String, required: false, description: 'Nome do usuário.' }],
    response: Usuario,
    isResponseArray: false,
  })
  //!EntidadeTeste usara apenas para verificar campos (não valida VO)
  buscaUsuario(@Param('nome') nome: string): Usuario {
    const usuario = new Usuario();
    usuario.nome = nome;
    return usuario;
  }
}
