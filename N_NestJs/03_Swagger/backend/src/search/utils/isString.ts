export function isString(value: any): boolean {
  // Se não for string, retorna false
  if (typeof value !== 'string' && !(value instanceof String)) {
    return false;
  }

  const stringValue = String(value).trim();

  // Verifica se é boolean
  if (stringValue.toLowerCase() === 'true' || stringValue.toLowerCase() === 'false') {
    return false;
  }

  // Verifica se é número
  if (!isNaN(Number(stringValue)) && stringValue !== '') {
    return false;
  }

  // Verifica se é data (formato ISO ou outras variações)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO format
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];

  for (const pattern of datePatterns) {
    if (pattern.test(stringValue)) {
      const dateTest = new Date(stringValue);
      if (!isNaN(dateTest.getTime())) {
        return false; // É uma data válida
      }
    }
  }

  // Se chegou até aqui, é realmente uma string
  return true;
}
