import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumersModule } from './rabbit-consumers/consumers.module';
import { ServerModule } from './rabbit-server/server.module';

@Module({
  imports: [ConsumersModule, ServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
