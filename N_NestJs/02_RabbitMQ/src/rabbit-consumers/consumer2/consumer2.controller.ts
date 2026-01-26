import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationMessage } from 'src/rabbit-server/types/NotificationMessage';
import { ProcessResponse } from 'src/rabbit-server/types/ProcessResponse';

@Controller()
export class Consumer2Controller {
  private readonly logger = new Logger(Consumer2Controller.name);

  // 🐱 Evento padrão (Consumidores 1 e 2)
  @EventPattern('cats.send')
  async handleNotification(@Payload() data: NotificationMessage) {
    try {
      console.log('🐱 Notificação recebida no Consumer2Controller:', data);
    } catch (error) {
      this.logger.error(`Erro ao processar notificação: ${error.message}`);
      throw error; // Re-throw para trigger retry automático
    }
  }

  // 🔗 EVENTO ENCADEADO - Consumer2 recebe dados processados pelo Consumer1
  @EventPattern('cats.chain.step2')
  async handleChainStep2(@Payload() data: any) {
    try {
      console.log('🎯 Consumer2 recebeu dados encadeados do Consumer1:', data);

      // Simula processamento final no Consumer2
      const finalResult = {
        ...data,
        message: `[Consumer2 finalizou] ${data.message}`,
        finalProcessedBy: 'Consumer2',
        finalProcessedAt: new Date(),
        chainStep: 2,
        chainCompleted: true,
      };

      console.log('✅ Processamento em cadeia finalizado:', finalResult);
      this.logger.log(`🏁 Consumer2 finalizou processamento da cadeia de eventos`);
    } catch (error) {
      this.logger.error(`❌ Erro no processamento final da cadeia: ${error.message}`);
      throw error;
    }
  }

  // 🔄 REQUEST-RESPONSE PATTERN
  @MessagePattern('cats.process') // ← Usa MessagePattern para resposta
  async processNotification(@Payload() data: NotificationMessage): Promise<ProcessResponse> {
    try {
      console.log('⚙️ Processando notificação com resposta:', data);

      // Simula processamento
      const processedResult: ProcessResponse = {
        originalMessage: data,
        processedAt: new Date(),
        status: 'SUCCESS',
        processedBy: 'Consumer2',
        result: `Mensagem "${data.message}" foi processada com sucesso!`,
      };

      // 🎯 Retorna resposta diretamente
      return processedResult;
    } catch (error) {
      this.logger.error(`Erro ao processar: ${error.message}`);
      return {
        status: 'ERROR',
        error: error.message,
        processedBy: 'Consumer2',
        processedAt: new Date(),
      };
    }
  }
}
