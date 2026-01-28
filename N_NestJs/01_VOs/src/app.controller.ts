import { Body, Controller, Post } from '@nestjs/common';
import { ExemploDto } from './dto/exemplo.dto';
import { EntidadeTeste } from './entities/usuario.entity';
import { EmailVO } from './VOs/EmailVO/EmailVO';
import { ResponseDto } from './dto/response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from './dto/error-response.dto';

@Controller()
export class AppController {
  constructor() {}

  @Post('teste')
  @ApiResponse({ status: 201, type: ResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  newUser(@Body() body: ExemploDto): ResponseDto {
    const newEntidade = EntidadeTeste.create(body);

    const responseDto = {
      grana: newEntidade.grana.toString(),
      email: newEntidade.email.getValue(),
      dataHora: newEntidade.dataHora.getValue(),
    } satisfies ResponseDto;

    return responseDto;
  }

  @Post('teste2')
  newUser2(@Body() body: ExemploDto) {
    const novaEntidade = EntidadeTeste.create(body);
    const entidadeAsJson = novaEntidade.toJson();

    const novaEntidade2 = EntidadeTeste.fromJson(entidadeAsJson);
    novaEntidade2.email = new EmailVO('novo-email@email.com');
    const entidade2AsJson = novaEntidade2.toJson();

    return {
      entidadeOriginal: novaEntidade,
      entidadeJson: entidadeAsJson,
      entidadeRecriada: novaEntidade2,
      entidadeRecriadaJson: entidade2AsJson,
    };
  }
}
