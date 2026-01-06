type Translation = typeof import('./base.json');
let dicionario: Record<string, Translation>;

function loadDicionario() {
  const base = require('./base.json');
  const en = deepMerge(base, require('./en/translation.json'));
  const es = deepMerge(base, require('./es/translation.json'));
  const fr = deepMerge(base, require('./fr/translation.json'));
  const ptBr = deepMerge(base, require('./ptBr/translation.json'));
  const ptPO = deepMerge(ptBr, require('./ptPO/translation.json'));

  dicionario = {
    en,
    es,
    fr,
    ptBr,
    ptPO,
  };
}

function recarregarDicionario() {
  // Limpa o cache do require para cada arquivo
  delete require.cache[require.resolve('./en/translation.json')];
  delete require.cache[require.resolve('./es/translation.json')];
  delete require.cache[require.resolve('./fr/translation.json')];
  delete require.cache[require.resolve('./ptBr/translation.json')];
  delete require.cache[require.resolve('./ptPO/translation.json')];
  loadDicionario();
}

function deepMerge(base: any, override: any): any {
  if (typeof base !== 'object' || base === null) return override ?? base;
  const result: any = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(base)) {
    result[key] = deepMerge(base[key], override?.[key]);
  }
  for (const key of Object.keys(override || {})) {
    if (!(key in base)) result[key] = override[key];
  }
  return result;
}

export { loadDicionario, recarregarDicionario, dicionario };

