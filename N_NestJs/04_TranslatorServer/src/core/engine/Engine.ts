import { BadRequestException } from '@nestjs/common';
import { InMemoryCache } from '../cache/InMemoryCache';
import { Provider } from '../contracts/Provider';
import { CatalogEntry, Environment } from '../contracts/Types';
import { MissingKeysStatus } from './interface/MissingKeysStatus';

export class Engine {
  private cache = new InMemoryCache();
  private readonly BASE_LANGUAGE = 'pt-BR';

  constructor(private readonly provider: Provider) {}

  //! busca dados
  async getCatalog(
    env: Environment,
    sistema: string,
    language: string,
    namespace: string,
  ): Promise<Record<string, any>> {
    language = this.validateLanguage(language);

    const cacheKey = `${sistema}:${language}:${namespace}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('Cache hit for key:', cacheKey);
      return cached;
    }

    //? sempre carrega o base
    const baseCatalog = await this.provider.load({ sistema, language: this.BASE_LANGUAGE, namespace, env });

    //? se for base, não faz merge
    if (language === this.BASE_LANGUAGE) {
      this.cache.set(cacheKey, baseCatalog);
      console.log('Cache miss for key:', cacheKey);
      return baseCatalog;
    }

    //? carrega tradução (pode estar incompleta ou vazia)
    const translationCatalog = await this.provider.load({ sistema, language, namespace, env });

    const merged = { ...baseCatalog, ...translationCatalog };

    this.cache.set(cacheKey, merged);
    console.log('Cache miss for key:', cacheKey);
    return merged;
  }

  //! adiciona entrada base (modelo verdade) (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async addBaseEntry(sistema: string, namespace: string, key: string) {
    const entry: CatalogEntry = {
      sistema,
      namespace,
      language: this.BASE_LANGUAGE,
      env: 'dev',
    };

    await this.provider.saveKey(entry, key, key);

    //? invalida cache do base
    this.cache.delete(`${sistema}:${this.BASE_LANGUAGE}:${namespace}`);
  }

  //! adiciona tradução para entrada base (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async addTranslation(sistema: string, namespace: string, language: string, key: string, value: string) {
    language = this.validateLanguage(language);

    if (language === this.BASE_LANGUAGE) {
      throw new BadRequestException('Base language does not accept translations');
    }

    if (!key || !key.trim()) {
      throw new BadRequestException('Invalid key');
    }

    const baseEntry = {
      sistema,
      namespace,
      language: this.BASE_LANGUAGE,
      env: 'dev',
    } satisfies CatalogEntry;

    const baseCatalog = await this.provider.load(baseEntry);

    if (!(key in baseCatalog)) {
      throw new BadRequestException(`Key '${key}' does not exist in base language`);
    }

    const translationEntry = {
      sistema,
      namespace,
      language,
      env: 'dev',
    } satisfies CatalogEntry;

    await this.provider.saveKey(translationEntry, key, value);

    //? invalida cache desse idioma
    this.cache.delete(`${sistema}:${language}:${namespace}`);
  }

  //! busca chaves que existem no base mas estão faltando na tradução
  async getMissingKeys(env: Environment, sistema: string, language: string, namespace: string): Promise<string[]> {
    language = this.validateLanguage(language);

    if (language === this.BASE_LANGUAGE) {
      return [];
    }

    const baseCatalog = await this.provider.load({ sistema, namespace, language: this.BASE_LANGUAGE, env });
    const translationCatalog = await this.provider.load({ sistema, namespace, language, env });

    const baseKeys = Object.keys(baseCatalog);
    const translationKeys = new Set(Object.keys(translationCatalog));

    return baseKeys.filter((key) => !translationKeys.has(key));
  }

  //! remove uma chave do base e de todas as traduções (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async removeKey(sistema: string, namespace: string, key: string) {
    if (!key || !key.trim()) {
      throw new BadRequestException('Invalid key');
    }

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

    //? invalida cache globalmente
    this.cache.clear();
  }

  //! lista namespaces existentes
  async listNamespaces(env: Environment, sistema: string): Promise<string[]> {
    const languages = this.BASE_LANGUAGE;
    return this.provider.listNamespaces(env, sistema, languages);
  }

  //! cria um namespace novo em todas as linguagens (a inclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async createNamespace(sistema: string, namespace: string) {
    if (!namespace || !namespace.trim()) {
      throw new Error('Invalid namespace');
    }

    const languages = await this.provider.listLanguages('dev', sistema);

    // se não houver idiomas ainda, isso é erro estrutural
    if (!languages.includes(this.BASE_LANGUAGE)) {
      throw new Error('Base language not found');
    }

    await Promise.all(languages.map((language) => this.provider.createNamespace(sistema, language, namespace)));

    this.cache.clear();
  }

  //! remove um namespace do base e de todas as traduções (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async removeNamespace(sistema: string, namespace: string) {
    if (!namespace || !namespace.trim()) {
      throw new BadRequestException('Invalid namespace');
    }

    const languages = await this.provider.listLanguages('dev', sistema);
    await Promise.all(languages.map((language) => this.provider.deleteNamespace(sistema, language, namespace)));

    //? invalida tudo relacionado
    this.cache.clear();
  }

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

    const languages = await this.provider.listLanguages('dev', sistema);

    if (languages.includes(language)) {
      throw new BadRequestException('Language already exists');
    }

    // base é obrigatória
    if (!languages.includes(this.BASE_LANGUAGE)) {
      throw new BadRequestException('Base language not found');
    }

    await this.provider.createLanguage(sistema, language);

    const namespaces = await this.provider.listNamespaces('dev', sistema, this.BASE_LANGUAGE);

    await Promise.all(namespaces.map((ns) => this.provider.createNamespace(sistema, language, ns)));

    this.cache.clear();
  }

  //! deleta um idioma (a exclusão ocorre apenas em Dev - para espelhar em prod deve-se usar 'publish')
  async deleteLanguage(sistema: string, language: string): Promise<void> {
    language = this.validateLanguage(language);

    if (language === this.BASE_LANGUAGE) {
      throw new Error('Base language cannot be deleted');
    }

    await this.provider.deleteLanguage(sistema, language);

    // invalida tudo desse idioma
    this.cache.deleteByPrefix(`${sistema}:${language}:`);
  }

  //! busca status de chaves faltantes por idioma e namespace
  async getMissingKeysStatus(env: Environment, sistema: string): Promise<Record<string, MissingKeysStatus>> {
    const languages = await this.provider.listLanguages(env, sistema);

    const namespaces = await this.provider.listNamespaces(env, sistema, this.BASE_LANGUAGE);

    // carrega base uma vez por namespace
    const baseCatalogs = new Map<string, Set<string>>();

    for (const ns of namespaces) {
      const baseData = await this.provider.load({
        sistema,
        language: this.BASE_LANGUAGE,
        namespace: ns,
        env,
      });

      baseCatalogs.set(ns, new Set(Object.keys(baseData)));
    }

    const result: Record<string, MissingKeysStatus> = {};

    for (const lang of languages) {
      if (lang === this.BASE_LANGUAGE) {
        result[lang] = { total: 0, namespaces: {} };
        continue;
      }

      let total = 0;
      const nsStatus: Record<string, number> = {};

      for (const ns of namespaces) {
        const baseKeys = baseCatalogs.get(ns)!;

        const data = await this.provider.load({
          sistema,
          language: lang,
          namespace: ns,
          env,
        });

        const currentKeys = new Set(Object.keys(data));

        const missing = [...baseKeys].filter((k) => !currentKeys.has(k));

        if (missing.length > 0) {
          nsStatus[ns] = missing.length;
          total += missing.length;
        }
      }

      result[lang] = {
        total,
        namespaces: nsStatus,
      };
    }

    return result;
  }

  //! publica mudanças de Dev para Prod
  async publishToProd(sistema: string): Promise<void> {
    await this.provider.publishEnvironment(sistema, 'dev', 'prod');
    this.cache.clear();
  }

  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
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
}
