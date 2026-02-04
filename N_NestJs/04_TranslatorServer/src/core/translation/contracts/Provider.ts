import { CatalogEntry } from './Types';

export interface Provider {
  //!carrega o json do namespace especifico
  load(catalogo: CatalogEntry): Promise<Record<string, any>>;

  //!sobre idiomas
  listLanguages(sistema: string): Promise<string[]>;
  createLanguage(sistema: string, language: string): Promise<void>;
  deleteLanguage(sistema: string, language: string): Promise<void>;

  //!trata apenas a chave especifica
  saveKey(entry: CatalogEntry, key: string, value: string): Promise<void>;
  deleteKey(entry: CatalogEntry, key: string): Promise<void>;

  //!trata todo o namespace
  listNamespaces(sistema: string, language: string): Promise<string[]>;
  createNamespace(sistema: string, language: string, namespace: string): Promise<void>;
  deleteNamespace(sistema: string, language: string, namespace: string): Promise<void>;
}
