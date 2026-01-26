import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServerService } from './server.service';
import { createQueueOptions, RABBITMQ_QUEUES } from '../rabbit-constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: createQueueOptions(RABBITMQ_QUEUES.PROCESSING), // 🎯 Queue específica
      },
    ]),
  ],
  controllers: [],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
