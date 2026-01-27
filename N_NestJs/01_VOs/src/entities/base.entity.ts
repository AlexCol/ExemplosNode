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

  static fromJson(
    json: Record<string, unknown>,
    voMappings?: Record<string, new (value: unknown) => unknown>,
  ): BaseEntity {
    const processedData: Record<string, unknown> = {};

    // 1. Primeiro, aplica mapeamentos explícitos se fornecidos
    if (voMappings) {
      Object.entries(voMappings).forEach(([prop, VOClass]) => {
        if (json[prop] !== undefined) {
          processedData[prop] = new VOClass(json[prop]);
        }
      });
    }

    // 2. Depois, tenta auto-detectar VOs por convenção
    Object.entries(json).forEach(([prop, value]) => {
      // Pula se já foi processado no mapeamento explícito
      if (processedData.hasOwnProperty(prop)) {
        return;
      }

      // Convenções para auto-detecção de VOs:
      const autoVOMappings = this.getAutoVOMappings();

      if (autoVOMappings[prop] && value !== null && value !== undefined) {
        processedData[prop] = new autoVOMappings[prop](value);
      } else {
        processedData[prop] = value;
      }
    });

    // 3. Tenta criar uma nova instância usando o construtor
    try {
      // Para classes com construtor padrão, passa os dados como parâmetros ordenados
      const instance = new this();

      // Atribui as propriedades processadas
      Object.assign(instance, processedData);

      return instance;
    } catch (error) {
      throw new Error(`Erro ao criar instância a partir do JSON: ${error}`);
    }
  }

  /****************************************************************************************/
  /* Metodo que precisa ser sobrescrito na classe filha                                   */
  /****************************************************************************************/
  protected static getAutoVOMappings(): Record<
    string,
    new (value: unknown) => unknown
  > {
    throw new Error('getAutoVOMappings deve ser sobrescrito na classe filha.');
  }
}
