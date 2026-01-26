import { Module } from '@nestjs/common';
import { Consumer2Controller } from './consumer2.controller';

@Module({
  controllers: [Consumer2Controller], // ✅ Só precisa do controller para RECEBER
})
export class Consumer2Module {}
