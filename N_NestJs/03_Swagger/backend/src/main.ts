import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //elimina do json de entrada valores que não estão no DTO
      forbidNonWhitelisted: true, //emite erro se houver valores não permitidos
      transform: true, //como 'true' tenta transformar os tipos das variáveis de entrada para os tipos definidos no tipo do metodo
    }),
  );

  setupSwagger(app);
  configCors(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .addServer(`http://localhost:${3000}`, 'Local server')
    .setTitle('Minha Api para Testes de VOs')
    .setDescription('# Uma descrição legal da API\n')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  // Scalar UI como interface principal
  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
      showDeveloperTools: 'never',
      theme: 'mars',
      darkMode: true,
      withFastify: true,
      layout: 'modern',
      pageTitle: 'API Documentation',
    }),
  );

  // Swagger endpoints para JSON e YAML
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: '/swagger/json',
    yamlDocumentUrl: '/swagger/yaml',
    swaggerUiEnabled: false,
  });
}

function configCors(app: INestApplication<any>) {
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
}
