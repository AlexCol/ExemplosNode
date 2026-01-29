export class BaseEntity {
  protected constructor() {}

  toJson(): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.getOwnPropertyNames(this).forEach((prop) => {
      const value = this[prop];

      // Se o valor tem um método getValue (é um VO), usa o valor primitivo
      if (value && typeof value.getValue === 'function') {
        result[prop] = value.getValue();
      } else {
        result[prop] = value;
      }
    });

    return result;
  }

  protected static fromJson(
    json: Record<string, unknown>,
    voMappings: Record<string, new (value: unknown) => unknown>,
  ): BaseEntity {
    const processedData: Record<string, unknown> = {};
    const baseProps = Object.getOwnPropertyNames(new this());

    // 1. Primeiro, aplica mapeamentos explícitos se fornecidos
    Object.entries(voMappings).forEach(([prop, VOClass]) => {
      // Ignora campos extras
      if (!baseProps.includes(prop)) return;

      if (json[prop] !== undefined) {
        processedData[prop] = new VOClass(json[prop]);
      }
    });

    // 2. Depois, carrega as demais propriedades diretamente
    Object.entries(json).forEach(([prop, value]) => {
      // Ignora campos extras
      if (!baseProps.includes(prop)) return;

      // Pula se já foi processado no mapeamento explícito
      if (processedData.hasOwnProperty(prop)) {
        return;
      }

      processedData[prop] = value;
    });

    // 3. Tenta criar uma nova instância usando o construtor
    try {
      const instance = new this();
      Object.assign(instance, processedData);
      return instance;
    } catch (error) {
      throw new Error(`Erro ao criar instância a partir do JSON: ${error}`);
    }
  }
}
