import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Consumer1Controller } from './consumer1.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMER1_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [Consumer1Controller],
})
export class Consumer1Module {}
