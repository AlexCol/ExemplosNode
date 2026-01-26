import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationMessage } from './types/NotificationMessage';
import { ProcessResponse } from './types/ProcessResponse';

@Injectable()
export class ServerService {
  private readonly logger = new Logger(ServerService.name);

  constructor(@Inject('NOTIFICATION_SERVICE') private client: ClientProxy) {}

  async sendCatsNotification(notification: Omit<NotificationMessage, 'timestamp'>): Promise<void> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.client.emit('cats.send', message);
    this.logger.log(`📤 Notificação ${message.type} enviada para fila: ${message.recipient}`);
  }

  async sendCatsNotificationOther(notification: Omit<NotificationMessage, 'timestamp'>): Promise<void> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.client.emit('cats.other', message);
    this.logger.log(`📤 Notificação ${message.type} enviada para fila: ${message.recipient}`);
  }

  async sendCatsNotificationAll(notification: Omit<NotificationMessage, 'timestamp'>): Promise<void> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.client.emit('cats.other', message); // Volta ao que funcionava
    this.logger.log(`📤 Notificação ${message.type} enviada para fila: ${message.recipient}`);
  }

  // 🔄 REQUEST-RESPONSE - Envia e aguarda resposta
  async processAndWaitResponse(notification: Omit<NotificationMessage, 'timestamp'>): Promise<ProcessResponse> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.logger.log(`🔄 Enviando requisição e aguardando resposta...`);

    try {
      // 🎯 send() aguarda resposta, diferente de emit()
      const response = await this.client.send('cats.process', message).toPromise();

      this.logger.log(`✅ Resposta recebida:`, response);
      return response;
    } catch (error) {
      this.logger.error(`❌ Erro na requisição: ${error.message}`);
      throw error;
    }
  }

  // 🔗 CADEIA DE EVENTOS - Inicia processamento encadeado Consumer1 → Consumer2
  async startEventChain(notification: Omit<NotificationMessage, 'timestamp'>): Promise<void> {
    const message: NotificationMessage = {
      ...notification,
      timestamp: new Date(),
    };

    this.client.emit('cats.chain', message);
    this.logger.log(`🔗 Cadeia de eventos iniciada: ${message.recipient}`);
  }
}
