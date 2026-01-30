import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SearchCriteriaReturnType } from '../dtos/SearchCriteriaReturnType';

export function ApiDocResponse<T>(entity: Type<T>, isPaginated: boolean, isArray: boolean) {
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  //! registra modelos necessários (SearchCriteriaReturnType só se paginado)
  const extraModels = isPaginated ? [SearchCriteriaReturnType, entity] : [entity];
  decorators.push(ApiExtraModels(...extraModels));

  //! schema da propriedade `data`
  const dataSchema =
    isArray || isPaginated
      ? { type: 'array', items: { $ref: getSchemaPath(entity) } }
      : { $ref: getSchemaPath(entity) };

  //! monta schema final
  const schema = isPaginated
    ? { allOf: [{ $ref: getSchemaPath(SearchCriteriaReturnType) }, { properties: { data: dataSchema } }] }
    : { type: 'object', properties: { data: dataSchema } };

  decorators.push(ApiResponse({ status: 200, schema }));

  return applyDecorators(...decorators);
}
