import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { createQueueOptions, RABBITMQ_QUEUES } from './rabbit-constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🎯 Conectar múltiplas queues
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: createQueueOptions(RABBITMQ_QUEUES.NOTIFICATIONS),
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: createQueueOptions(RABBITMQ_QUEUES.PROCESSING),
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: createQueueOptions(RABBITMQ_QUEUES.CHAIN),
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 Aplicação rodando na porta 3000');
  console.log('🐰 RabbitMQ conectado na fila: cats_queue');
}
bootstrap();
