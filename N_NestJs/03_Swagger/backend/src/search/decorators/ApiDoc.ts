import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation, ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';
import { ApiDocBody } from './ApiDocBody';
import { ApiDocErrorResponse } from './ApiDocErrorResponse';
import { ApiDocParam } from './ApiDocParam';
import { ApiDocQuery } from './ApiDocQuery';
import { ApiDocResponse } from './ApiDocResponse';

interface ApiDocOptions {
  summary: string;
  description?: string;
  params?: Type<unknown> | ApiParamOptions[];
  query?: Type<unknown> | ApiQueryOptions[];
  body?: Type<unknown>;
  response?: Type<unknown>;
  isPaginated?: boolean;
  isResponseArray?: boolean;
  errStatus?: number[];
}

export function ApiDoc(options: ApiDocOptions) {
  const decorators: MethodDecorator[] = [];

  // Adiciona a operação com sumário e descrição
  decorators.push(
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  );

  //Adiciona path parameters
  if (options.params) {
    decorators.push(ApiDocParam(options.params));
  }

  // Adiciona query parameters
  if (options.query) {
    decorators.push(ApiDocQuery(options.query, options.isPaginated || false));
  }

  // Adiciona o corpo da requisição
  if (options.body) {
    decorators.push(ApiDocBody(options.body));
  }

  if (options.response) {
    decorators.push(ApiDocResponse(options.response, options.isPaginated ?? false, options.isResponseArray ?? false));
  }

  // Adiciona respostas de erro
  decorators.push(ApiDocErrorResponse(options.errStatus || [400]));

  return applyDecorators(...decorators);
}
