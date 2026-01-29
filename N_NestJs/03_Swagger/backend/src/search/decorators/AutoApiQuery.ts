import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function AutoApiQuery<T>(entity: Type<T>) {
  // Pega as propriedades decoradas com @ApiProperty
  const entityProps = Object.getOwnPropertyNames(new entity());

  // Campos extras de paginação e ordenação
  const extraFields = [
    { name: 'page', type: Number, required: false, description: 'Page number' },
    { name: 'limit', type: Number, required: false, description: 'Items per page' },
    { name: 'order-field', type: String, required: false, description: 'Field to order by' },
    { name: 'order-direction', type: String, required: false, description: 'Order direction (ASC/DESC)' },
  ];

  const decorators = [
    ...entityProps.map((prop) => ApiQuery({ name: prop, required: false, description: `Field from entity: ${prop}` })),
    ...extraFields.map((field) => ApiQuery(field)),
  ];

  return applyDecorators(...decorators);
}
