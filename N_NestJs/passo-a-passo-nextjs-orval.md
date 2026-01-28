# Integração Next.js + Orval com NestJS

Este guia mostra como criar um frontend Next.js e consumir a API NestJS documentada com Swagger usando Orval.

---

## 1. Criar o Projeto Next.js

```bash
npx create-next-app@latest frontend-orval --typescript
cd frontend-orval
```

## 2. Instalar o Orval

```bash
npm install orval --save-dev
```

## 3. Configurar o Orval

Crie um arquivo `orval.config.ts` na raiz do projeto:

```typescript
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "http://localhost:3000/swagger/json", // URL do Swagger gerado pelo NestJS
    output: {
      mode: "tags-split",
      target: "src/api/generated/api.ts",
      schemas: "src/api/generated/models",
      client: "react-query", // ou 'axios', 'swr', etc.
      prettier: true,
    },
  },
});
```

> **Obs:** O servidor NestJS deve estar rodando para acessar o Swagger JSON.

## 4. Gerar os Clientes com Orval

```bash
npx orval
```

Os arquivos gerados ficarão em `src/api/generated/`.

## 5. Usar o Cliente Gerado no Next.js

Exemplo de uso em um componente:

```tsx
// src/app/page.tsx
"use client";
import { useApiTesteCreate } from "@/api/generated/api";

export default function Home() {
  const { mutate, data, isLoading } = useApiTesteCreate();

  return (
    <div>
      <button onClick={() => mutate({ email: "teste@email.com", grana: "100.00", dataHora: new Date().toISOString() })}>Criar usuário</button>
      {isLoading && <p>Carregando...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## 6. Dicas

- O Orval gera hooks para React Query por padrão.
- Os tipos dos DTOs do backend são refletidos no frontend.
- Se mudar a API, rode `npx orval` novamente.

---

## Referências

- [Orval Docs](https://orval.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
