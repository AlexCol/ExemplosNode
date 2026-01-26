# RabbitMQ Example - NestJS

Um exemplo prático e funcional de RabbitMQ com NestJS, sem dependências de banco de dados.

## 📦 1. Instalação

```bash
npm install @nestjs/microservices amqplib
npm install @types/amqplib --save-dev
```

## 🔧 2. Configuração Básica

### Atualizar `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 📝 3. Serviço de Notificações (Producer)

### Criar `src/notification/notification.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
```

### Criar `src/notification/notification.service.ts`

```typescript
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface NotificationMessage {
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(@Inject('NOTIFICATION_SERVICE') private client: ClientProxy) {}

  async sendNotification(notification: Omit<NotificationMessage, 'timestamp'>): Promise<void> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.client.emit('notification.send', message);
    this.logger.log(`📤 Notificação ${message.type} enviada para fila: ${message.recipient}`);
  }

  async sendWelcomeNotification(name: string, email: string): Promise<void> {
    await this.sendNotification({
      type: 'email',
      recipient: email,
      subject: 'Bem-vindo!',
      message: `Olá ${name}, seja bem-vindo ao nosso sistema!`,
    });
  }

  async sendOrderConfirmation(customerName: string, email: string, orderId: string): Promise<void> {
    await this.sendNotification({
      type: 'email',
      recipient: email,
      subject: 'Pedido Confirmado',
      message: `Olá ${customerName}, seu pedido #${orderId} foi confirmado com sucesso!`,
    });
  }
}
```

## ⚙️ 4. Controller de Notificações (Consumer)

### Criar `src/notification/notification.controller.ts`

```typescript
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationMessage } from './notification.service';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  @EventPattern('notification.send')
  async handleNotification(@Payload() data: NotificationMessage, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.processNotification(data);
      
      // Confirma que a mensagem foi processada
      channel.ack(originalMsg);
      
    } catch (error) {
      this.logger.error(`Erro ao processar notificação: ${error.message}`);
      
      // Rejeita a mensagem (volta para a fila para retry)
      channel.nack(originalMsg, false, true);
    }
  }

  private async processNotification(notification: NotificationMessage): Promise<void> {
    this.logger.log(`🔄 Processando notificação ${notification.type} para ${notification.recipient}`);

    // Simula processamento (substituir por integração real)
    switch (notification.type) {
      case 'email':
        await this.sendEmail(notification);
        break;
      case 'sms':
        await this.sendSMS(notification);
        break;
      case 'push':
        await this.sendPushNotification(notification);
        break;
      default:
        throw new Error(`Tipo de notificação não suportado: ${notification.type}`);
    }

    this.logger.log(`✅ Notificação ${notification.type} processada com sucesso!`);
  }

  private async sendEmail(notification: NotificationMessage): Promise<void> {
    // Simula envio de email
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.logger.log(`📧 Email enviado para ${notification.recipient}: ${notification.subject}`);
  }

  private async sendSMS(notification: NotificationMessage): Promise<void> {
    // Simula envio de SMS
    await new Promise(resolve => setTimeout(resolve, 500));
    this.logger.log(`📱 SMS enviado para ${notification.recipient}`);
  }

  private async sendPushNotification(notification: NotificationMessage): Promise<void> {
    // Simula envio de push notification
    await new Promise(resolve => setTimeout(resolve, 300));
    this.logger.log(`🔔 Push notification enviada para ${notification.recipient}`);
  }
}
```

## 🎯 5. Usando no AppController

### Atualizar `src/app.controller.ts`

```typescript
import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationService } from './notification/notification.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { name: string; email: string }) {
    this.logger.log(`Enviando mensagem de boas-vindas para ${body.name}`);
    
    // Envia notificação assíncrona
    await this.notificationService.sendWelcomeNotification(body.name, body.email);
    
    // Resposta imediata para o usuário
    return { 
      message: 'Notificação de boas-vindas enviada!',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('order')
  async confirmOrder(@Body() body: { customerName: string; email: string; orderId: string }) {
    this.logger.log(`Confirmando pedido ${body.orderId} para ${body.customerName}`);
    
    // Envia confirmação assíncrona
    await this.notificationService.sendOrderConfirmation(
      body.customerName, 
      body.email, 
      body.orderId
    );
    
    return { 
      message: 'Pedido confirmado! Você receberá um email em breve.',
      orderId: body.orderId,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('notify')
  async sendCustomNotification(@Body() body: { 
    type: 'email' | 'sms' | 'push';
    recipient: string;
    subject?: string;
    message: string;
  }) {
    this.logger.log(`Enviando notificação ${body.type} para ${body.recipient}`);
    
    await this.notificationService.sendNotification(body);
    
    return { 
      message: `Notificação ${body.type} enviada!`,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## 📊 6. Configuração do Main (Microservice)

### Atualizar `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Criar aplicação HTTP
    const app = await NestFactory.create(AppModule);
    
    // Adicionar microservice RabbitMQ
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'notification_queue',
        queueOptions: {
          durable: true,
        },
      },
    });

    // Iniciar microservices primeiro
    await app.startAllMicroservices();
    logger.log('🐰 RabbitMQ microservice iniciado');

    // Depois iniciar HTTP server
    await app.listen(3000);
    logger.log('🚀 API HTTP iniciada na porta 3000');

  } catch (error) {
    logger.error('Erro ao iniciar aplicação:', error);
  }
}

bootstrap();
```

## 🐳 7. Docker Compose (RabbitMQ)

### Criar `docker-compose.yml`

```yaml
version: '3.8'
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq-example
    ports:
      - "5672:5672"     # AMQP
      - "15672:15672"   # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 30s
      timeout: 30s
      retries: 3

volumes:
  rabbitmq_data:
```

## 🚀 8. Como Executar

### 1. Instalar dependências
```bash
npm install @nestjs/microservices amqplib
npm install @types/amqplib --save-dev
```

### 2. Subir RabbitMQ
```bash
docker-compose up -d
```

### 3. Iniciar aplicação
```bash
npm run start:dev
```

### 4. Testar endpoints

**Enviar boas-vindas:**
```bash
curl -X POST http://localhost:3000/welcome \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@example.com"}'
```

**Confirmar pedido:**
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{"customerName": "Maria", "email": "maria@example.com", "orderId": "12345"}'
```

**Enviar notificação personalizada:**
```bash
curl -X POST http://localhost:3000/notify \
  -H "Content-Type: application/json" \
  -d '{"type": "email", "recipient": "teste@example.com", "subject": "Teste", "message": "Mensagem de teste"}'
```

### 5. Monitorar filas
- **Management UI**: http://localhost:15672 (guest/guest)
- **Logs da aplicação**: Veja o console do NestJS

## ✅ 9. Vantagens desta Implementação

- ✅ **Sem banco de dados**: Focado apenas em messaging
- ✅ **Resposta imediata**: API responde instantaneamente
- ✅ **Processamento assíncrono**: Notificações são processadas em background
- ✅ **Retry automático**: Mensagens falhas são reprocessadas
- ✅ **Logs claros**: Fácil debug e monitoramento
- ✅ **Escalável**: Adicione mais workers facilmente
- ✅ **Testável**: Mocks simples para testes

## 🔄 10. Fluxo Completo

```
1. POST /welcome → AppController
2. controller.sendWelcome() → resposta IMEDIATA ✅
3. NotificationService.sendWelcomeNotification() → RabbitMQ
4. RabbitMQ entrega → NotificationController.handleNotification()
5. Processamento assíncrono (simula envio de email)
6. Log de sucesso ✅
```