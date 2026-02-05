import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import { Provider } from '../../contracts/Provider';
import { CatalogEntry, Environment } from '../../contracts/Types';
import { BadRequestException } from '@nestjs/common';
import { ReadableStream } from 'stream/web';

export class BunnyStorageProvider implements Provider {
  private readonly storageZone: BunnyStorageSDK.StorageZone;

  private readonly translationsPath: string;
  constructor(key: string, rootPath: string, translationsPath: string) {
    this.storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
      BunnyStorageSDK.regions.StorageRegion.SaoPaulo,
      rootPath,
      key,
    );
    this.translationsPath = translationsPath;
  }

  /*****************************************************/
  /* Metodos da Interface                              */
  /*****************************************************/
  async load(entry: CatalogEntry): Promise<Record<string, any>> {
    const path = this.resolvePath(entry);

    try {
      const response = await BunnyStorageSDK.file.download(this.storageZone, path);

      const buffer = await this.streamToBuffer(response.stream);
      return JSON.parse(buffer.toString('utf-8'));
    } catch (error) {
      console.error('Error loading translation file:', error);
      // arquivo não existe ou inválido
      return {};
    }
  }

  async saveKey(entry: CatalogEntry, key: string, value: any): Promise<void> {
    const filePath = this.resolvePath(entry);
    const data = await this.load(entry);

    if (key in data) {
      throw new BadRequestException(`Key '${key}' already exists`);
    }

    data[key] = value;

    const jsonString = JSON.stringify(data, null, 2);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);

    const stream = ReadableStream.from([uint8Array]);

    await BunnyStorageSDK.file.upload(this.storageZone, filePath, stream);
  }

  async deleteKey(entry: CatalogEntry, key: string): Promise<void> {
    const filePath = this.resolvePath(entry);

    const data = await this.load(entry);

    // se a key não existe, não faz nada (ou pode lançar erro se quiser)
    if (!(key in data)) {
      return;
    }

    delete data[key];

    const jsonString = JSON.stringify(data, null, 2);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);

    const stream = ReadableStream.from([uint8Array]);

    await BunnyStorageSDK.file.upload(this.storageZone, filePath, stream);
  }

  async listLanguages(env: Environment, sistema: string): Promise<string[]> {
    const prefix = this.resolveSystemPrefix(env, sistema);
    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);

    const directories = items.filter((i) => i.isDirectory);

    // Filtrar apenas pastas que têm conteúdo
    const nonEmptyDirs = await Promise.all(
      directories.map(async (dir) => {
        const languagePrefix = `${prefix}/${dir.objectName}`;
        const contents = await BunnyStorageSDK.file.list(this.storageZone, languagePrefix);
        return contents.length > 0 ? dir.objectName : null;
      }),
    );

    return nonEmptyDirs.filter((name) => name !== null) as string[];
  }

  async createLanguage(sistema: string, language: string): Promise<void> {
    const prefix = this.resolveLanguagePrefix('dev', sistema, language); //env: 'dev', //só se deleta diretamente o arquivo em DEV (prod é via publish)

    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);
    if (items.length > 0) {
      throw new Error(`Language '${language}' already exists`);
    }

    // Criar stream vazio
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(0));
        controller.close();
      },
    });

    await BunnyStorageSDK.file.upload(this.storageZone, `${prefix}/.keep`, stream);
  }

  async deleteLanguage(sistema: string, language: string): Promise<void> {
    const prefix = this.resolveLanguagePrefix('dev', sistema, language); //env: 'dev', //só se deleta diretamente o arquivo em DEV (prod é via publish)

    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);

    if (!items.length) {
      throw new Error(`Language '${language}' does not exist`);
    }

    for (const item of items) {
      await BunnyStorageSDK.file.remove(this.storageZone, `${prefix}/${item.objectName}`);
    }
    // A pasta vazia é automaticamente removida pelo Bunny
  }

  async listNamespaces(env: Environment, sistema: string, language: string): Promise<string[]> {
    const prefix = this.resolveLanguagePrefix(env, sistema, language);
    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);
    return items.filter((i) => i.objectName.endsWith('.json')).map((i) => i.objectName.replace('.json', ''));
  }

  async createNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const entry: CatalogEntry = {
      sistema,
      language,
      namespace,
      env: 'dev', //só se deleta diretamente o arquivo em DEV (prod é via publish)
    };

    const filePath = this.resolvePath(entry);

    try {
      await BunnyStorageSDK.file.download(this.storageZone, filePath);
      throw new Error(`Namespace '${namespace}' already exists`);
    } catch {
      // ok
    }

    const jsonString = JSON.stringify({}, null, 2);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);

    const stream = ReadableStream.from([uint8Array]);

    await BunnyStorageSDK.file.upload(this.storageZone, filePath, stream);
  }

  async deleteNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const entry: CatalogEntry = {
      sistema,
      language,
      namespace,
      env: 'dev', //só se deleta diretamente o arquivo em DEV (prod é via publish)
    };
    const filePath = this.resolvePath(entry);

    try {
      await BunnyStorageSDK.file.remove(this.storageZone, filePath);
    } catch {
      throw new Error(`Namespace '${namespace}' does not exist`);
    }
  }

  async publishEnvironment(sistema: string, from: 'dev', to: 'prod'): Promise<void> {
    const sourcePrefix = `${this.translationsPath}/${from}/${sistema}`;
    const targetPrefix = `${this.translationsPath}/${to}/${sistema}`;

    // 1. Limpar target
    await this.deleteDirectoryRecursive(targetPrefix);

    // 2. Copiar tudo de source para target (recursivo)
    await this.copyDirectoryRecursive(sourcePrefix, targetPrefix);
  }

  private async deleteDirectoryRecursive(prefix: string): Promise<void> {
    try {
      const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);

      for (const item of items) {
        const itemPath = `${prefix}/${item.objectName}`;

        if (item.isDirectory) {
          await this.deleteDirectoryRecursive(itemPath);
        } else {
          await BunnyStorageSDK.file.remove(this.storageZone, itemPath);
        }
      }
    } catch {
      // Pasta não existe, ok
    }
  }

  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
  private resolvePath({ env, sistema, language, namespace }: CatalogEntry): string {
    return `${this.translationsPath}/${env}/${sistema}/${language}/${namespace}.json`.replace(/^\/+/, '');
  }

  private resolveLanguagePrefix(env: Environment, sistema: string, language: string): string {
    return `${this.translationsPath}/${env}/${sistema}/${language}`.replace(/^\/+/, '');
  }

  private resolveSystemPrefix(env: Environment, sistema: string): string {
    return `${this.translationsPath}/${env}/${sistema}`.replace(/^\/+/, '');
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return Buffer.concat(chunks.map((c) => Buffer.from(c)));
  }

  private async copyDirectoryRecursive(sourcePrefix: string, targetPrefix: string): Promise<void> {
    const items = await BunnyStorageSDK.file.list(this.storageZone, sourcePrefix);

    for (const item of items) {
      const sourcePath = `${sourcePrefix}/${item.objectName}`;
      const targetPath = `${targetPrefix}/${item.objectName}`;

      if (item.isDirectory) {
        // Recursivamente copiar subpastas
        await this.copyDirectoryRecursive(sourcePath, targetPath);
      } else {
        // Copiar arquivo
        const file = await BunnyStorageSDK.file.download(this.storageZone, sourcePath);
        await BunnyStorageSDK.file.upload(this.storageZone, targetPath, file.stream);
      }
    }
  }
}
