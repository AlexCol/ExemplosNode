import { Module } from '@nestjs/common';
import { Consumer1Module } from './consumer1/consumer1.module';
import { Consumer2Module } from './consumer2/consumer2.module';

@Module({
  imports: [Consumer1Module, Consumer2Module],
})
export class ConsumersModule {}
