import { Environment } from '@/core/contracts/Types';
import { Engine } from '@/core/engine/Engine';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  constructor(private readonly engine: Engine) {}

  /**********************************************/
  /* Publisher                                  */
  /**********************************************/
  async publishToProd(sistema: string): Promise<void> {
    return await this.engine.publishToProd(sistema);
  }

  /**********************************************/
  /* Getters                                    */
  /**********************************************/
  async getCatalog(env: Environment, sistema: string, lang: string, namespace: string) {
    return await this.engine.getCatalog(env, sistema, lang, namespace);
  }

  async getMissingKeys(env: Environment, sistema: string, lang: string, namespace: string) {
    return await this.engine.getMissingKeys(env, sistema, lang, namespace);
  }

  async listNamespaces(env: Environment, sistema: string) {
    return await this.engine.listNamespaces(env, sistema);
  }

  async listLanguages(env: Environment, sistema: string) {
    return await this.engine.listLanguages(env, sistema);
  }

  getMissingKeysStatus(env: Environment, sistema: string) {
    return this.engine.getMissingKeysStatus(env, sistema);
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
