import { BadRequestException, Logger } from '@nestjs/common';
import { InMemoryCache } from '../cache/InMemoryCache';
import { Provider } from '../contracts/Provider';
import { CatalogEntry, Environment } from '../contracts/Types';
import { AvailableLanguages, MissingKeysStatus } from './interface/MissingKeysStatus';

export class Engine {
  private readonly logger = new Logger(Engine.name);
  private static cache = new InMemoryCache();
  private static availableLanguages: AvailableLanguages = {};
  private readonly BASE_LANGUAGE = 'pt-BR';

  constructor(private readonly provider: Provider) {}

  //#region Getter Catalog
  /**********************************************/
  /* Getter Catalog                             */
  /**********************************************/
  //! busca dados
  async getCatalog(
    env: Environment,
    sistema: string,
    language: string,
    namespace: string,
  ): Promise<Record<string, any>> {
    language = this.validateLanguage(language);
    await this.languageAvailableOrThow(env, sistema, language);

    //? tenta cache primeiro
    const cacheKey = `${env}:${sistema}:${language}:${namespace}`;
    const cached = Engine.cache.get(cacheKey);
    if (cached) {
      this.logger.verbose(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    //? sempre carrega o base
    const baseCatalog = await this.provider.load({ sistema, language: this.BASE_LANGUAGE, namespace, env });

    //? se for base, não faz merge
    if (language === this.BASE_LANGUAGE) {
      Engine.cache.set(cacheKey, baseCatalog);
      this.logger.verbose(`Cache miss for key: ${cacheKey}`);
      return baseCatalog;
    }

    //? carrega tradução (pode estar incompleta ou vazia)
    let translationCatalog: Record<string, any>;

    //? suporte para fallback de idioma (ex: en-US -> en)
    if (language.length !== 2 && language.includes('-')) {
      const baseLangCatalog = await this.provider.load({ sistema, language: language.split('-')[0], namespace, env });
      const specificLangCatalog = await this.provider.load({ sistema, language, namespace, env });
      translationCatalog = { ...baseLangCatalog, ...specificLangCatalog };
    } else {
      translationCatalog = await this.provider.load({ sistema, language, namespace, env });
    }

    const merged = { ...baseCatalog, ...translationCatalog };

    Engine.cache.set(cacheKey, merged);
    this.logger.verbose(`Cache miss for key: ${cacheKey}`);
    return merged;
  }
  //#endregion

  //#region About Keys
  /**********************************************/
  /* About Keys                                 */
  /**********************************************/
  //! adiciona entrada base (modelo verdade) (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async addBaseEntry(sistema: string, namespace: string, key: string) {
    //? valida chave
    this.validateKey(key);

    const entry: CatalogEntry = { sistema, namespace, language: this.BASE_LANGUAGE, env: 'dev' };
    await this.provider.saveKey(entry, key, key);

    //? invalida cache do base em dev
    this.clearCache('dev');
  }

  //! adiciona tradução para entrada base (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async addTranslation(sistema: string, namespace: string, language: string, key: string, value: string) {
    //? valida chave
    this.validateKey(key);

    language = this.validateLanguage(language);
    await this.languageAvailableOrThow('dev', sistema, language);
    if (language === this.BASE_LANGUAGE) {
      throw new BadRequestException('Base language does not accept translations');
    }

    const availableLanguages = await this.provider.listLanguages('dev', sistema);
    if (!availableLanguages.includes(language)) {
      throw new BadRequestException('Language does not exist');
    }

    const baseEntry = { sistema, namespace, language: this.BASE_LANGUAGE, env: 'dev' } satisfies CatalogEntry;
    const baseCatalog = await this.provider.load(baseEntry);

    if (!(key in baseCatalog)) {
      throw new BadRequestException(`Key '${key}' does not exist in base language`);
    }

    const translationEntry = { sistema, namespace, language, env: 'dev' } satisfies CatalogEntry;
    await this.provider.saveKey(translationEntry, key, value);

    //? invalida cache desse idioma em dev
    this.clearCache();
  }

  //! remove uma chave do base e de todas as traduções (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async removeKey(sistema: string, namespace: string, key: string) {
    //? valida chave
    this.validateKey(key);

    //? garante que existe no base
    const baseEntry: CatalogEntry = { sistema, namespace, language: this.BASE_LANGUAGE, env: 'dev' };
    const baseCatalog = await this.provider.load(baseEntry);
    if (!(key in baseCatalog)) {
      throw new BadRequestException(`Key '${key}' does not exist in base language`);
    }

    //? remove do base
    await this.provider.deleteKey(baseEntry, key);

    //? remove de todas as outras linguagens
    const languages = await this.provider.listLanguages('dev', sistema);
    await Promise.all(
      languages
        .filter((lang) => lang !== this.BASE_LANGUAGE)
        .map((lang) => this.provider.deleteKey({ sistema, namespace, language: lang, env: 'dev' }, key)),
    );

    //? invalida cache do idioma base em dev
    this.clearCache(`${'dev'}`);
  }

  //! busca chaves que existem no base mas estão faltando na tradução
  async getMissingKeys(env: Environment, sistema: string, language: string, namespace: string): Promise<string[]> {
    language = this.validateLanguage(language);
    await this.languageAvailableOrThow(env, sistema, language);

    if (language === this.BASE_LANGUAGE) {
      return [];
    }

    const baseCatalog = await this.provider.load({ sistema, namespace, language: this.BASE_LANGUAGE, env });
    const translationCatalog = await this.provider.load({ sistema, namespace, language, env });

    const baseKeys = Object.keys(baseCatalog);
    const translationKeys = new Set(Object.keys(translationCatalog));

    return baseKeys.filter((key) => !translationKeys.has(key));
  }

  //! busca status de chaves faltantes por idioma e namespace
  async getMissingKeysStatus(env: Environment, sistema: string): Promise<Record<string, MissingKeysStatus>> {
    const languages = await this.provider.listLanguages(env, sistema);
    const namespaces = await this.provider.listNamespaces(env, sistema, this.BASE_LANGUAGE);

    //? carrega base uma vez por namespace
    const baseCatalogs = new Map<string, Set<string>>();

    //? para cada namespace, carrega o base e guarda as chaves em um Set para comparação rápida
    for (const ns of namespaces) {
      const baseData = await this.provider.load({ sistema, language: this.BASE_LANGUAGE, namespace: ns, env });
      baseCatalogs.set(ns, new Set(Object.keys(baseData)));
    }

    //? para cada idioma, compara com o base e conta chaves faltantes por namespace e total
    const result: Record<string, MissingKeysStatus> = {};
    for (const lang of languages) {
      //* idioma base não tem chaves faltantes
      if (lang === this.BASE_LANGUAGE) {
        result[lang] = { total: 0, namespaces: {} };
        continue;
      }

      let total = 0;
      const nsStatus: Record<string, number> = {};

      for (const ns of namespaces) {
        //* pega as chaves do base para esse namespace (já em Set para comparação rápida)
        const baseKeys = baseCatalogs.get(ns)!;
        //* pega as chaves do idioma para esse namespace
        const data = await this.provider.load({ sistema, language: lang, namespace: ns, env });
        //* compara chaves do idioma com o base para encontrar faltantes
        const currentKeys = new Set(Object.keys(data));
        //* filtra chaves que estão no base mas não estão no idioma atual
        const missing = [...baseKeys].filter((k) => !currentKeys.has(k));
        //* se houver chaves faltantes, registra no status do namespace e incrementa total
        if (missing.length > 0) {
          nsStatus[ns] = missing.length;
          total += missing.length;
        }
      }

      result[lang] = { total, namespaces: nsStatus };
    }

    return result;
  }

  //! lista o valor de uma chave em todos os idiomas para comparação
  async getKeyTranslations(env: Environment, sistema: string, namespace: string, key: string) {
    //? valida chave
    this.validateKey(key);

    //? pega todos os idiomas disponíveis
    const languages = await this.provider.listLanguages(env, sistema);

    //? carrega/obtém catálogos do cache próprio (sem fallback)
    const catalogsPromises = languages.map((lang) => {
      const cacheKey = `${env}:${sistema}:${lang}:${namespace}:raw`;
      const cached = Engine.cache.get(cacheKey);

      if (cached) {
        this.logger.verbose(`Cache hit for catalog: ${cacheKey}`);
        return Promise.resolve(cached);
      }

      //? carrega do provider e cacheia
      const langEntry = { sistema, namespace, language: lang, env } satisfies CatalogEntry;
      return this.provider.load(langEntry).then((catalog) => {
        Engine.cache.set(cacheKey, catalog);
        this.logger.verbose(`Cache miss for catalog: ${cacheKey}`);
        return catalog;
      });
    });
    const catalogs = await Promise.all(catalogsPromises);

    //? verifica se chave existe no base
    const baseIndex = languages.indexOf(this.BASE_LANGUAGE);
    if (!(key in catalogs[baseIndex])) {
      throw new BadRequestException(`Key '${key}' does not exist in base language`);
    }

    //? monta resultado com os valores das chaves
    const result: Record<string, { value: string | null; translated: boolean }> = {};
    languages.forEach((lang, index) => {
      const langCatalog = catalogs[index];

      result[lang] =
        key in langCatalog
          ? { value: langCatalog[key], translated: lang !== this.BASE_LANGUAGE }
          : { value: null, translated: false };
    });

    return result;
  }
  //#endregion

  //#region About Namespaces
  /**********************************************/
  /* About Namespaces                           */
  /**********************************************/
  //! lista namespaces existentes
  async listNamespaces(env: Environment, sistema: string): Promise<string[]> {
    const languages = this.BASE_LANGUAGE;
    return this.provider.listNamespaces(env, sistema, languages);
  }

  //! cria um namespace novo em todas as linguagens (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async createNamespace(sistema: string, namespace: string) {
    //? valida namespace
    this.validateNamespace(namespace);

    //? se não houver idiomas ainda, isso é erro estrutural
    const languages = await this.provider.listLanguages('dev', sistema);
    if (!languages.includes(this.BASE_LANGUAGE)) {
      throw new BadRequestException('Base language not found');
    }

    //? cria namespace em todas as linguagens
    await Promise.all(languages.map((language) => this.provider.createNamespace(sistema, language, namespace)));

    //? invalida cache todo relacionado ao sistema
    this.clearCache(`${'dev'}:${sistema}`);
  }

  //! remove um namespace do base e de todas as traduções (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async removeNamespace(sistema: string, namespace: string) {
    //? valida namespace
    this.validateNamespace(namespace);

    //? busca linguagens para remover de cada uma delas
    const languages = await this.provider.listLanguages('dev', sistema);
    await Promise.all(languages.map((language) => this.provider.deleteNamespace(sistema, language, namespace)));

    //? invalida cache todo relacionado ao sistema
    this.clearCache(`${'dev'}:${sistema}`);
  }
  //#endregion

  //#region About Languages
  /**********************************************/
  /* About Languages                            */
  /**********************************************/
  //! lista os idiomas existentes
  async listLanguages(env: Environment, sistema: string): Promise<string[]> {
    const languages = await this.provider.listLanguages(env, sistema);

    // opcional: garantir que base sempre exista
    if (!languages.includes(this.BASE_LANGUAGE)) {
      throw new BadRequestException(`Base language '${this.BASE_LANGUAGE}' not found`);
    }

    return languages;
  }

  //! cria um novo idioma baseado no base (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async createLanguage(sistema: string, language: string) {
    language = this.validateLanguage(language);

    //? verifica se já existe
    const languages = await this.provider.listLanguages('dev', sistema);
    if (languages.includes(language)) {
      throw new BadRequestException('Language already exists');
    }

    //? base é obrigatória
    if (!languages.includes(this.BASE_LANGUAGE)) {
      throw new BadRequestException('Base language not found');
    }

    //? cria idioma
    await this.provider.createLanguage(sistema, language);

    //? copia namespaces do base para o novo idioma
    const namespaces = await this.provider.listNamespaces('dev', sistema, this.BASE_LANGUAGE);
    await Promise.all(namespaces.map((ns) => this.provider.createNamespace(sistema, language, ns)));

    //? invalida cache todo relacionado ao sistema
    this.clearCache(`${'dev'}:${sistema}`);
    if (Engine.availableLanguages['dev']) {
      Engine.availableLanguages['dev'] = {};
    }
  }

  //! deleta um idioma (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async deleteLanguage(sistema: string, language: string): Promise<void> {
    language = this.validateLanguage(language);

    //? idioma base não pode ser deletado
    if (language === this.BASE_LANGUAGE) {
      throw new Error('Base language cannot be deleted');
    }

    //? remove idioma
    await this.provider.deleteLanguage(sistema, language);

    //? invalida cache todo relacionado ao idioma no sistema
    this.clearCache(`${'dev'}:${sistema}:${language}`);
    if (Engine.availableLanguages['dev']) {
      Engine.availableLanguages['dev'] = {};
    }
  }
  //#endregion

  //#region About Merge between Environments
  /**********************************************/
  /* About Merge between Environments           */
  /**********************************************/
  //! publica mudanças de Dev para Prod
  async publishToProd(sistema: string): Promise<void> {
    await this.provider.publishEnvironment(sistema, 'dev', 'prod');
    this.clearCache(`prod:${sistema}`);
  }
  //#endregion

  //#region Private Methods
  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
  private validateKey(key: string) {
    //? valida chave
    if (!key || !key.trim()) {
      throw new BadRequestException('Invalid key');
    }
  }

  private validateNamespace(namespace: string) {
    //? valida namespace
    if (!namespace || !namespace.trim()) {
      throw new BadRequestException('Invalid namespace');
    }
  }

  private validateLanguage(language: string) {
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(language)) {
      throw new BadRequestException('Invalid language format');
    }

    try {
      return Intl.getCanonicalLocales(language)[0];
    } catch {
      throw new BadRequestException('Language not supported by Intl');
    }
  }

  private async getAvailableLanguages(env: Environment, sistema: string): Promise<string[]> {
    if (!Engine.availableLanguages[env]) {
      Engine.availableLanguages[env] = {};
    }

    if (!Engine.availableLanguages[env][sistema]) {
      const languages = await this.provider.listLanguages(env, sistema);
      Engine.availableLanguages[env][sistema] = languages;
    }

    return Engine.availableLanguages[env][sistema];
  }

  private async languageAvailableOrThow(env: Environment, sistema: string, language: string): Promise<void> {
    const availableLanguages = await this.getAvailableLanguages(env, sistema);
    if (!availableLanguages.includes(language)) {
      throw new BadRequestException('Language does not exist');
    }
  }

  private clearCache(prefix?: string) {
    if (prefix) {
      Engine.cache.deleteByPrefix(prefix);
      Engine.cache.deleteBySuffix('raw');
      this.logger.verbose(`Cache cleared for prefix: ${prefix}`);
      return;
    }

    Engine.cache.clear();
    this.logger.verbose('Cache cleared');
  }
  //#endregion
}
