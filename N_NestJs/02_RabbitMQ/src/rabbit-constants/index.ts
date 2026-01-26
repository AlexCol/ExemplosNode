const RABBITMQ_SERVICE_OPTIONS = {
  urls: ['amqp://localhost:5672'],
  queue: 'cats_queue',
  queueOptions: {
    durable: false,
  },
};

// 🏭 Factory function - alternativa ao spread
export const createRabbitMQOptions = () => ({
  ...RABBITMQ_SERVICE_OPTIONS,
});

// 🎯 ALTERNATIVA - Queues específicas
export const RABBITMQ_QUEUES = {
  MAIN: 'cats_queue', // Queue principal
  NOTIFICATIONS: 'notifications_queue', // Para notificações
  PROCESSING: 'processing_queue', // Para processamento
  CHAIN: 'chain_queue', // Para eventos encadeados
};

export const createQueueOptions = (queueName: string) => ({
  urls: ['amqp://localhost:5672'],
  queue: queueName,
  queueOptions: {
    durable: true,
  },
});
