# Observabilidade em NestJS + Fastify (Guia de Estudos e Exemplos)

Este guia foi pensado para iniciar estudos práticos de observabilidade em um projeto NestJS usando Fastify.

Objetivo:

- Coletar métricas com Prometheus
- Coletar traces com OpenTelemetry
- Visualizar traces no Jaeger
- Criar dashboards no Grafana

## 0. Pré-requisitos

- Node.js 18+
- Docker + Docker Compose
- Nest CLI (`npm i -g @nestjs/cli`)

Criar projeto base:

```bash
nest new observability-demo
cd observability-demo
```

## 1. Instalar dependências

```bash
npm install @nestjs/platform-fastify
npm install @opentelemetry/api
npm install @opentelemetry/resources
npm install @opentelemetry/semantic-conventions
npm install @opentelemetry/sdk-node
npm install @opentelemetry/auto-instrumentations-node
npm install @opentelemetry/exporter-trace-otlp-http
npm install @opentelemetry/exporter-prometheus
```

## 2. Trocar Express por Fastify

Edite `src/main.ts`:

```ts
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { sdk } from "./telemetry";

async function bootstrap() {
  await sdk.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, "0.0.0.0");
}

bootstrap();
```

## 3. Criar endpoints de teste

Edite `src/app.controller.ts`:

```ts
import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("ok")
  ok() {
    return { status: "ok" };
  }

  @Get("slow")
  async slow() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { status: "slow response" };
  }

  @Get("error")
  error() {
    throw new HttpException("Erro simulado", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
```

## 4. Configurar OpenTelemetry

Crie `src/telemetry.ts`:

```ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const prometheusExporter = new PrometheusExporter({
  port: 9464,
});

export const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "observability-demo",
    [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "local",
  }),
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});
```

## 5. Encerramento limpo da telemetria (recomendado)

Atualize `src/main.ts` para encerrar SDK ao finalizar o processo:

```ts
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { sdk } from "./telemetry";

async function bootstrap() {
  await sdk.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, "0.0.0.0");

  const shutdown = async (signal: string) => {
    try {
      await app.close();
      await sdk.shutdown();
      process.exit(0);
    } catch (error) {
      console.error(`Erro no shutdown (${signal}):`, error);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap();
```

## 6. Subir stack de observabilidade com Docker

Crie `docker-compose.yml` na raiz:

```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"

  jaeger:
    image: jaegertracing/all-in-one
    ports:
      - "16686:16686"
      - "4318:4318"
```

Crie `prometheus.yml`:

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: "nest-app"
    static_configs:
      - targets: ["host.docker.internal:9464"]
```

## 7. Executar e gerar tráfego

Em um terminal:

```bash
docker compose up -d
```

Em outro terminal:

```bash
npm run start:dev
```

Gere tráfego:

- http://localhost:3000/ok
- http://localhost:3000/slow
- http://localhost:3000/error

## 8. Visualizar dados

Prometheus:

- URL: http://localhost:9090
- Query inicial sugerida: `http_server_duration` ou busque por `http*` para encontrar o nome exato da métrica da sua versão

Grafana:

- URL: http://localhost:3001
- Login padrão: `admin / admin`
- Data Source Prometheus: `http://prometheus:9090`

Jaeger:

- URL: http://localhost:16686
- Service: `observability-demo`

## 9. Resultado esperado

Você deve conseguir observar:

- Latência mais alta em `/slow`
- Erros em `/error`
- Traces de cada requisição no Jaeger
- Métricas HTTP expostas para scrape do Prometheus

## 10. Experimentos para evoluir

1. Adicionar logs estruturados com correlação (`trace_id`, `span_id`, `request_id`)
2. Criar métricas customizadas de negócio (ex.: total de pedidos processados)
3. Subir um segundo serviço e propagar contexto entre serviços
4. Simular timeout/retry e analisar impacto nos traces
5. Criar alertas no Grafana (erro alto e latência alta)
