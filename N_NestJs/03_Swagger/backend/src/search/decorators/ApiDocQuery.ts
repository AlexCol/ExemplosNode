import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export function ApiDocQuery<T>(entity: Type<T> | ApiQueryOptions[], isPaginated: boolean) {
  //! array base para os decorators
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  //? Se veio como ApiQueryOptions[], são critérios customizados
  if (Array.isArray(entity)) {
    decorators.push(...entity.map((query) => ApiQuery(query)));
  }

  //? se veio como Type<T> é 'function' construtora de entidade
  if (typeof entity === 'function') {
    // Pega as propriedades decoradas com @ApiProperty da entidade
    const entityProps = Object.getOwnPropertyNames(new (entity as Type<T>)());
    decorators.push(
      ...entityProps.map((prop) =>
        ApiQuery({ name: prop, required: false, description: `Campo da entidade: ${prop}` }),
      ),
    );
  }

  //? idependente se demais campos são customizados ou entidade, adiciona paginação se for o caso
  if (isPaginated) {
    // Campos extras de paginação e ordenação
    const extraFields: ApiQueryOptions[] = [
      { name: 'page', type: Number, required: false, description: 'Número da página.' },
      { name: 'limit', type: Number, required: false, description: 'Número de itens por página.' },
      { name: 'orderField', type: String, required: false, description: 'Campo para ordenar' },
      { name: 'orderDirection', type: String, required: false, description: 'Direção da ordenação (asc/desc)' },
    ];
    decorators.push(...extraFields.map((field) => ApiQuery(field)));
  }
  return applyDecorators(...decorators);
}
