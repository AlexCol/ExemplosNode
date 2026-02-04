import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import { Provider } from '../../contracts/Provider';
import { CatalogEntry } from '../../contracts/Types';
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

  async listLanguages(sistema: string): Promise<string[]> {
    const prefix = this.resolveSystemPrefix(sistema);

    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);

    return items.filter((i) => i.isDirectory).map((i) => i.objectName);
  }

  async createLanguage(sistema: string, language: string): Promise<void> {
    const prefix = this.resolveLanguagePrefix(sistema, language);

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

  //TODO
  async deleteLanguage(sistema: string, language: string): Promise<void> {}

  async listNamespaces(sistema: string, language: string): Promise<string[]> {
    const prefix = this.resolveLanguagePrefix(sistema, language);
    const items = await BunnyStorageSDK.file.list(this.storageZone, prefix);
    return items.filter((i) => i.objectName.endsWith('.json')).map((i) => i.objectName.replace('.json', ''));
  }

  async createNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const entry: CatalogEntry = {
      sistema,
      language,
      namespace,
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
    };
    const filePath = this.resolvePath(entry);

    try {
      await BunnyStorageSDK.file.remove(this.storageZone, filePath);
    } catch {
      throw new Error(`Namespace '${namespace}' does not exist`);
    }
  }

  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
  private resolvePath({ sistema, language, namespace }: CatalogEntry): string {
    return `${this.translationsPath}/${sistema}/${language}/${namespace}.json`.replace(/^\/+/, '');
  }

  private resolveLanguagePrefix(sistema: string, language: string): string {
    return `${this.translationsPath}/${sistema}/${language}`.replace(/^\/+/, '');
  }

  private resolveSystemPrefix(sistema: string): string {
    return `${this.translationsPath}/${sistema}`.replace(/^\/+/, '');
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
}
