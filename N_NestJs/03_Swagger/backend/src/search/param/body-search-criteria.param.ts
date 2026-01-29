import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { SearchCriteriaDto } from '../dtos/SearchCriteriaDto';

export const BodySearchCriteria = createParamDecorator(async (entityType: any, ctx: ExecutionContext) => {
  const context = ctx.switchToHttp();
  const request = context.getRequest();

  const body = request.body as SearchCriteriaDto;
  if (!body) {
    throw new BadRequestException('Request body is missing.');
  }

  //! 1. Converte o body para a classe DTO (ativa os decorators @Type)
  const dtoInstance = plainToClass(SearchCriteriaDto, body, { enableImplicitConversion: true });

  //! 2. Valida a estrutura do DTO usando class-validator
  const errors = await validate(dtoInstance, {
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false, value: false }, // Remove target e value para resposta mais limpa
  });

  if (errors.length > 0) {
    const messages = extractErrorMessages(errors);

    throw new BadRequestException({
      statusCode: 400,
      message: messages,
    });
  }

  //! 3. Valida se os campos 'field' pertencem à entidade
  if (entityType) {
    const allowedFields = Object.keys(new entityType());

    // Valida campos do 'where'
    if (dtoInstance.where && Array.isArray(dtoInstance.where)) {
      const invalidWhereFields = dtoInstance.where
        .map((w) => w.field)
        .filter((field) => !allowedFields.includes(field));

      if (invalidWhereFields.length > 0) {
        throw new BadRequestException(
          `Campos inválidos em 'where': ${invalidWhereFields.join(', ')}. ` +
            `Campos permitidos: ${allowedFields.join(', ')}`,
        );
      }
    }

    // Valida campos do 'sort'
    if (dtoInstance.sort && Array.isArray(dtoInstance.sort)) {
      const invalidSortFields = dtoInstance.sort.map((s) => s.field).filter((field) => !allowedFields.includes(field));

      if (invalidSortFields.length > 0) {
        throw new BadRequestException(
          `Campos inválidos em 'sort': ${invalidSortFields.join(', ')}. ` +
            `Campos permitidos: ${allowedFields.join(', ')}`,
        );
      }
    }
  }
  return dtoInstance;
});

// Função recursiva para extrair todas as mensagens de erro
function extractErrorMessages(errors: ValidationError[], parentPath = ''): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    // Se tem constraints diretas (validações do próprio campo)
    if (error.constraints) {
      messages.push(...Object.values(error.constraints).map((msg) => `${propertyPath}: ${msg}`));
    }

    // Se tem erros aninhados (para arrays e objetos)
    if (error.children && error.children.length > 0) {
      messages.push(...extractErrorMessages(error.children, propertyPath));
    }
  }

  return messages;
}
