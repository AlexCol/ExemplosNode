export type Sistema = string;
export type Namespace = string;
export type Language = string;

export type Environment = 'dev' | 'prod';

export interface CatalogEntry {
  sistema: Sistema;
  namespace: Namespace;
  language: Language;
  env: Environment;
}
