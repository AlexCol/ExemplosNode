import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ExemploDto } from './dto/exemplo.dto';
import { ResponseDto } from './dto/response.dto';
import { EntidadeTeste } from './entities/usuario.entity';
import { ApiDoc } from './search/decorators/ApiDoc';
import { EmailVO } from './VOs/EmailVO/EmailVO';

class testeTwoDto {
  @ApiProperty({ type: EntidadeTeste })
  entidadeOriginal: EntidadeTeste;
  @ApiProperty()
  entidadeJson: JSON;
  @ApiProperty({ type: EntidadeTeste })
  entidadeRecriada: EntidadeTeste;
  @ApiProperty()
  entidadeRecriadaJson: JSON;
}

@Controller()
export class AppController {
  constructor() {}

  @Post('teste')
  @ApiDoc({
    summary: 'Teste de criação e serialização de EntidadeTeste',
    body: ExemploDto,
    response: ResponseDto,
  })
  testeOne(@Body() body: ExemploDto): ResponseDto {
    const newEntidade = EntidadeTeste.create(body);

    const responseDto = {
      id: '4564981',
      grana: newEntidade.grana.toString(),
      email: newEntidade.email.getValue(),
      dataHora: newEntidade.dataHora.getValue(),
    } satisfies ResponseDto;

    return responseDto;
  }

  @Post('teste2')
  @ApiDoc({
    summary: 'Teste de criação, serialização e desserialização de EntidadeTeste',
    body: ExemploDto,
    response: testeTwoDto,
  })
  testeTwo(@Body() body: ExemploDto) {
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
