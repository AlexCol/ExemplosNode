import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Consumer1Controller } from './consumer1.controller';
import { createQueueOptions, RABBITMQ_QUEUES } from '../../rabbit-constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMER1_CLIENT', //@Inject('CONSUMER1_CLIENT') private client: ClientProxy,
        transport: Transport.RMQ,
        options: createQueueOptions(RABBITMQ_QUEUES.CHAIN), // 🔄 usar a Queue chain para mandar.
      },
    ]),
  ],
  controllers: [Consumer1Controller],
})
export class Consumer1Module {}
