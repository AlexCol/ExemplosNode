import { CatalogEntry, Environment } from './Types';

export interface Provider {
  //!carrega o json do namespace especifico
  load(catalogo: CatalogEntry): Promise<Record<string, any>>;

  //!sobre idiomas
  listLanguages(env: Environment, sistema: string): Promise<string[]>;
  createLanguage(sistema: string, language: string): Promise<void>;
  deleteLanguage(sistema: string, language: string): Promise<void>;

  //!trata apenas a chave especifica
  saveKey(entry: CatalogEntry, key: string, value: string): Promise<void>;
  deleteKey(entry: CatalogEntry, key: string): Promise<void>;

  //!trata todo o namespace
  listNamespaces(env: Environment, sistema: string, language: string): Promise<string[]>;
  createNamespace(sistema: string, language: string, namespace: string): Promise<void>;
  deleteNamespace(sistema: string, language: string, namespace: string): Promise<void>;

  //!publica para produlção
  publishEnvironment(sistema: string, from: 'dev', to: 'prod'): Promise<void>;
}
