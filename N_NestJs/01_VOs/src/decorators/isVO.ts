import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import InvalidValueObjectError from 'src/VOs/VOError/InvalidValueObjectError';

type VOConstructor<T> = new (value: unknown) => T;

//#region Constraint
@ValidatorConstraint({ name: 'voValidator', async: false })
export class VOValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [VoClass] = args.constraints as [VOConstructor<any>];

    // Já transformado
    if (value instanceof VoClass) {
      return true;
    }

    try {
      new VoClass(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [VoClass] = args.constraints as [VOConstructor<any>];
    const value = args.value;

    if (value === null || value === undefined) {
      return `${args.property} é obrigatório`;
    }

    try {
      new VoClass(value);
    } catch (err) {
      if (err instanceof InvalidValueObjectError) {
        return `${args.property} ${err.message}`;
      }
    }

    return `${args.property} possui valor inválido`;
  }
}
//#endregion

//#region Decorator
export function isVO<T>(
  VoClass: VOConstructor<T>,
  validationOptions?: ValidationOptions,
) {
  return function (target: any, propertyKey: string) {
    // Transformação: tenta converter para VO
    Transform(({ value }: TransformFnParams) => {
      if (value === null || value === undefined) {
        return value;
      }

      if (value instanceof VoClass) {
        return value;
      }

      try {
        return new VoClass(value);
      } catch {
        return value;
      }
    })(target, propertyKey);

    // Validação
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      constraints: [VoClass],
      validator: VOValidatorConstraint,
    });
  };
}
//#endregion
