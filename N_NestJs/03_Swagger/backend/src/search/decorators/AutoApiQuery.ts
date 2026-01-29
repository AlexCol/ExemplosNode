import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function AutoApiQuery<T>(entity: Type<T>) {
  // Pega as propriedades decoradas com @ApiProperty
  const entityProps = Object.getOwnPropertyNames(new entity());

  // Campos extras de paginação e ordenação
  const extraFields = [
    { name: 'page', type: Number, required: false, description: 'Número da página.' },
    { name: 'limit', type: Number, required: false, description: 'Número de itens por página.' },
    { name: 'order-field', type: String, required: false, description: 'Campo para ordenar' },
    { name: 'order-direction', type: String, required: false, description: 'Direção da ordenação (asc/desc)' },
  ];

  const decorators = [
    ...entityProps.map((prop) => ApiQuery({ name: prop, required: false, description: `Campo da entidade: ${prop}` })),
    ...extraFields.map((field) => ApiQuery(field)),
  ];

  return applyDecorators(...decorators);
}
