import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  setCors(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //elimina do json de entrada valores que não estão no DTO
      forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
      transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no tipo do metodo
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

export default function setCors(app: NestFastifyApplication): void {
  const isProduction = false;

  app.enableCors({
    origin: isProduction
      ? ['https://meudominio.com']
      : (origin, callback) => {
          // Permite localhost e IPs da rede local
          const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 192.168.x.x
            /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 10.x.x.x
            /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 172.16-31.x.x
          ];

          if (
            !origin ||
            allowedOrigins.some((allowed) => (typeof allowed === 'string' ? allowed === origin : allowed.test(origin)))
          ) {
            callback(null, true); // ✅ Primeiro arg: erro (null = sem erro), segundo: permitido (true)
          } else {
            callback(null, false); // ✅ Não permite, mas sem erro
            // OU se quiser retornar erro:
            // callback(new Error('Not allowed by CORS'), false);
          }
        },

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Accept-Language',
      'Accept-Encoding',
      'remember-me',
      'Cache-Control',
    ],

    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400,
  });
}
