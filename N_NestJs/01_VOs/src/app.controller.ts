import { Body, Controller, Post } from '@nestjs/common';
import { ExemploDto } from './dto/exemplo.dto';

@Controller()
export class AppController {
  constructor() {}

  @Post('teste')
  newUser(@Body() body: ExemploDto) {
    return body;
  }
}
