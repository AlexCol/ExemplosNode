import { Injectable } from '@nestjs/common';
import { Environment } from '@/core/contracts/Types';
import { Engine } from '@/core/engine/Engine';

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

  async getMissingKeysStatus(env: Environment, sistema: string) {
    return await this.engine.getMissingKeysStatus(env, sistema);
  }

  async getKeyTranslations(env: Environment, sistema: string, namespace: string, key: string) {
    return await this.engine.getKeyTranslations(env, sistema, namespace, key);
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

  async createNamespace(sistema: string, namespace: string) {
    return await this.engine.createNamespace(sistema, namespace);
  }

  async createLanguage(sistema: string, language: string) {
    return await this.engine.createLanguage(sistema, language);
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

  async deleteLanguage(sistema: string, language: string) {
    return await this.engine.deleteLanguage(sistema, language);
  }
}
