import { Body, Controller, Post } from '@nestjs/common';
import { ExemploDto } from './dto/exemplo.dto';
import { EntidadeTeste } from './entities/usuario.entity';
import { EmailVO } from './VOs/EmailVO/EmailVO';

@Controller()
export class AppController {
  constructor() {}

  @Post('teste')
  newUser(@Body() body: ExemploDto) {
    return body;
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
