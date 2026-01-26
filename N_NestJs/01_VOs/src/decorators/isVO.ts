import { Transform, TransformFnParams } from 'class-transformer';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import InvalidValueObjectError from '../VOs/_InvalidValueObjectError.js';

// Constraint personalizado para validação de VOs
@ValidatorConstraint({ name: 'voValidator', async: false })
export class VOValidatorConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {
    const [VoClass, isOptional] = args.constraints;

    // Se está undefined/null, valida de acordo com isOptional
    if (value === null || value === undefined) {
      return isOptional;
    }

    // Se já é uma instância do VO, considerar válido
    if (value instanceof VoClass) {
      return true;
    }

    try {
      new VoClass(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [VoClass, isOptional] = args.constraints;
    const value = args.value;

    // Se não é opcional e está undefined/null
    if (!isOptional && (value === null || value === undefined)) {
      return `${args.property} é obrigatório`;
    }

    // Se já é uma instância do VO, não há erro
    if (value instanceof VoClass) {
      return '';
    }

    try {
      new VoClass(value);
    } catch (err) {
      if (err instanceof InvalidValueObjectError) {
        return err.message;
      }
      return err.message || 'Invalid value';
    }

    return 'Invalid value';
  }
}

export function isVO<T>(VoClass: new (value: any) => T, validationOptions?: ValidationOptions) {
  return function (target: any, propertyKey: string) {

    // Verificar se existe @IsOptional() usando Reflect
    const existingMetadata = Reflect.getMetadata('custom:validation', target) || {};
    const isOptional = existingMetadata[propertyKey]?.isOptional || false;

    // Aplicar transformação
    Transform(({ value }: TransformFnParams) => {
      if (value === null || value === undefined) {
        return value;
      }

      try {
        return new VoClass(value);
      } catch (err) {
        return value;
      }
    })(target, propertyKey);

    // Aplicar validação com o parâmetro isOptional
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      constraints: [VoClass, isOptional],
      validator: VOValidatorConstraint,
    });
  };
}