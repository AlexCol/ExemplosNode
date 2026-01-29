import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SearchCriteriaReturnType } from '../dtos/SearchCriteriaReturnType';

export function ApiSearchResponse<T = any>(item: Type<T>) {
  return applyDecorators(
    ApiExtraModels(SearchCriteriaReturnType, item),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SearchCriteriaReturnType) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(item) },
              },
            },
          },
        ],
      },
    }),
  );
}
