import { Engine } from '@/core/translation/engine/Engine';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  constructor(private readonly engine: Engine) {}

  /**********************************************/
  /* Getters                                    */
  /**********************************************/
  async getCatalog(sistema: string, lang: string, namespace: string) {
    return await this.engine.getCatalog(sistema, lang, namespace);
  }

  async getMissingKeys(sistema: string, lang: string, namespace: string) {
    return await this.engine.getMissingKeys(sistema, lang, namespace);
  }

  async listNamespaces(sistema: string) {
    return await this.engine.listNamespaces(sistema);
  }

  async listLanguages(sistema: string) {
    return await this.engine.listLanguages(sistema);
  }

  getMissingKeysStatus(sistema: string) {
    return this.engine.getMissingKeysStatus(sistema);
  }

  /**********************************************/
  /* Setters                                    */
  /**********************************************/
  async addBaseEntry(sistema: string, namespace: string, key: string) {
    return await this.engine.addBaseEntry(sistema, namespace, key);
  }

  async addTranslation(sistema: string, namespace: string, lang: string, key: string, value: string) {
    return await this.engine.addTranslation(sistema, namespace, lang, key, value);
  }

  createNamespace(sistema: string, namespace: string) {
    return this.engine.createNamespace(sistema, namespace);
  }

  createLanguage(sistema: string, language: string) {
    return this.engine.createLanguage(sistema, language);
  }

  /**********************************************/
  /* Deleters                                   */
  /**********************************************/
  async removeKey(sistema: string, namespace: string, key: string) {
    return await this.engine.removeKey(sistema, namespace, key);
  }

  async removeNamespace(sistema: string, namespace: string) {
    return await this.engine.removeNamespace(sistema, namespace);
  }

  deleteLanguage(sistema: string, language: string) {
    return this.engine.deleteLanguage(sistema, language);
  }
}
