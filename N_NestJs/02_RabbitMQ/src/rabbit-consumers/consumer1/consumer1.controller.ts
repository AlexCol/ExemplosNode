import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { NotificationMessage } from 'src/rabbit-server/types/NotificationMessage';

@Controller()
export class Consumer1Controller {
  private readonly logger = new Logger(Consumer1Controller.name);

  constructor(@Inject('CONSUMER1_CLIENT') private client: ClientProxy) {}

  // 🐱 Evento padrão (Consumidores 1 e 2)
  @EventPattern('cats.send')
  async handleNotification(@Payload() data: NotificationMessage) {
    try {
      console.log('🐱 Notificação cats.send recebida no Consumer1:', data);
    } catch (error) {
      this.logger.error(`Erro ao processar notificação: ${error.message}`);
      throw error;
    }
  }

  // Outra rota de notificação (só do consumidor1)
  @EventPattern('cats.other')
  async handleOther(@Payload() data: NotificationMessage) {
    try {
      console.log('🐱 Notificação cats.other recebida no Consumer1:', data);
    } catch (error) {
      this.logger.error(`Erro ao processar notificação: ${error.message}`);
      throw error;
    }
  }

  // 🔗 EVENTO ENCADEADO - Consumer1 processa e envia para Consumer2
  @EventPattern('cats.chain')
  async handleChainedEvent(@Payload() data: NotificationMessage) {
    try {
      console.log('🔗 Consumer1 processando evento encadeado:', data);

      // Simula processamento no Consumer1
      const processedData = {
        ...data,
        message: `[Consumer1 processou] ${data.message}`,
        processedBy: 'Consumer1',
        processedAt: new Date(),
        chainStep: 1,
      };

      // 🎯 Emite evento para Consumer2 na queue NOTIFICATIONS
      this.client.emit('cats.chain.step2', processedData);
      this.logger.log(`⚡ Consumer1 enviou dados processados para Consumer2 (NOTIFICATIONS queue)`);
    } catch (error) {
      this.logger.error(`❌ Erro no processamento encadeado: ${error.message}`);
      throw error;
    }
  }
}
