import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiDoc } from './decorators/ApiDoc';

export class Base {
  @ApiProperty({ description: 'Identificador único' })
  @IsString()
  id: string;
}
export class Usuario extends Base {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  nome: string;
}

@Controller('usuarios')
export class UsuariosController {
  constructor() {}

  @Get()
  @ApiDoc({
    summary: 'Busca de usuários',
    query: Usuario,
    //response: Usuario,
    //isResponseArray: false,
    isPaginated: true,
    isResponseArray: false,
  })
  //!EntidadeTeste usara apenas para verificar campos (não valida VO)
  buscaUsuario(@Query() usuario: Usuario): Usuario {
    console.log('Busca usuario: ', usuario);
    const usuarioResponse = new Usuario();
    usuarioResponse.nome = usuario.nome;
    return usuarioResponse;
  }
}
