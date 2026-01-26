export class BaseEntity {

  toJson(): Record<string, any> {
    const result: Record<string, any> = {};

    Object.getOwnPropertyNames(this).forEach((prop) => {
      const value = (this as any)[prop];

      // Se o valor tem um método getValue (é um VO), usa o valor primitivo
      if (value && typeof value.getValue === 'function') {
        result[prop] = value.getValue();
      } else {
        result[prop] = value;
      }
    });

    return result;
  }
}