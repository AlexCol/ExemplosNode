import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .addServer(`http://localhost:${3000}`, 'Local server')
    .setTitle('SySafra API')
    .setDescription(
      '# SySafra Back-end\n\n' +
        'API back-end para o sistema SySafra, oferecendo funcionalidades robustas para gerenciamento agrícola em um ambiente SaaS multi-inquilino.\n\n' +
        '## Recursos\n\n' +
        '- **Cache com Redis**: Suporte completo a cache com múltiplas estratégias\n' +
        '- **Validação**: Validação automática de DTOs com class-validator\n' +
        '- **Logs**: Morgan para logs de requisição e resposta\n' +
        '- **Segurança**: Helmet configurado para proteção contra vulnerabilidades comuns\n' +
        '- **Performance**: Fastify para máxima performance\n\n',
    )
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  // Scalar UI como interface principal
  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
      showDeveloperTools: 'never',
      theme: 'bluePlanet',
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
