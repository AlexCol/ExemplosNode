/* eslint-disable */
// ⚠️ Arquivo gerado automaticamente
// NÃO EDITE MANUALMENTE

export type Langs = 'en' | 'pt-BR';
export const LangsList: Langs[] = ['en', 'pt-BR'];

export type Namespace = 'contratos' | 'faturamento' | 'financeiro' | 'usuarios';
export const NamespacesList: Namespace[] = ['contratos', 'faturamento', 'financeiro', 'usuarios'];

export interface Translation {
  contratos: typeof import('./../jsons/contratos.json');
  faturamento: typeof import('./../jsons/faturamento.json');
  financeiro: typeof import('./../jsons/financeiro.json');
  usuarios: typeof import('./../jsons/usuarios.json');
}
