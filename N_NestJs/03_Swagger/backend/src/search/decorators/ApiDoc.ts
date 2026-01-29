import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/dto/error-response.dto';
import { ApiSearchResponse } from './ApiSearchResponse';
import { AutoApiQuery } from './AutoApiQuery';

interface ApiDocOptions {
  summary: string;
  description?: string;
  query?: Type<any>;
  body?: Type<any>;
  isPaginated?: boolean;
  isResponseArray?: boolean;
  response?: Type<any>;
}

export function ApiDoc(options: ApiDocOptions) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  ];

  // Adiciona query parameters
  if (options.query) {
    decorators.push(AutoApiQuery(options.query));
  }

  if (options.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  // Configura a resposta
  if (options.isPaginated && options.response) {
    decorators.push(ApiSearchResponse(options.response));
  } else {
    decorators.push(ApiResponse({ status: 200, type: options.response, isArray: options.isResponseArray }));
  }

  decorators.push(ApiResponse({ status: 400, type: ErrorResponseDto }));

  return applyDecorators(...decorators);
}
