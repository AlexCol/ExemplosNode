import { Controller, Get } from '@nestjs/common';
import { ServerService } from './rabbit-server/server.service';
import { ProcessResponse } from './rabbit-server/types/ProcessResponse';

@Controller()
export class AppController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  sendCatsNotification(): string {
    this.serverService.sendCatsNotification({
      type: 'cats',
      recipient: 'teste',
      subject: 'Bem-vindo!',
      message: `Olá, seja bem-vindo ao nosso sistema!`,
    });
    return 'Notification sent';
  }

  @Get('other')
  sendCatsNotificationOther(): string {
    this.serverService.sendCatsNotificationOther({
      type: 'cats',
      recipient: 'teste-other',
      subject: 'Outra Notificação!',
      message: `Esta é outra notificação para você!`,
    });
    return 'Other notification sent';
  }

  @Get('all')
  sendCatsNotificationAll(): string {
    this.serverService.sendCatsNotificationAll({
      type: 'cats',
      recipient: 'teste-*',
      subject: 'Outra Notificação!',
      message: `Esta é outra notificação para você!`,
    });
    return 'Other notification sent';
  }

  // 🔄 REQUEST-RESPONSE ENDPOINT
  @Get('process')
  async processWithResponse(): Promise<{ message: string; response?: ProcessResponse; error?: string }> {
    try {
      const response = await this.serverService.processAndWaitResponse({
        type: 'cats',
        recipient: 'teste-response',
        subject: 'Processamento com Resposta',
        message: `Processe esta mensagem e me devolva o resultado!`,
      });

      return {
        message: 'Processamento concluído!',
        response: response,
      };
    } catch (error) {
      return {
        message: 'Erro no processamento',
        error: error.message,
      };
    }
  }

  // 🔗 CADEIA DE EVENTOS ENDPOINT
  @Get('chain')
  startEventChain(): string {
    this.serverService.startEventChain({
      type: 'cats',
      recipient: 'chain-test',
      subject: 'Evento Encadeado',
      message: `Esta mensagem será processada em cadeia: Consumer1 → Consumer2`,
    });
    return 'Cadeia de eventos iniciada! Check logs: HTTP → Consumer1 → Consumer2';
  }
}
