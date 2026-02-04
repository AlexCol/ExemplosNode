import { promises as fs } from 'fs';
import path, { join } from 'path';
import { Provider } from '../../contracts/Provider';
import { CatalogEntry } from '../../contracts/Types';
import { BadRequestException } from '@nestjs/common';

export class FileSystemProvider implements Provider {
  constructor(private readonly basePath: string) {}

  /*****************************************************/
  /* Metodos da Interface                              */
  /*****************************************************/
  async load(catalogo: CatalogEntry) {
    const { sistema, language, namespace } = catalogo;
    const filePath = path.join(this.basePath, sistema, language, `${namespace}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  async listLanguages(sistema: string): Promise<string[]> {
    const systemPath = path.join(this.basePath, sistema);
    const entries = await fs.readdir(systemPath, { withFileTypes: true });

    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  async createLanguage(sistema: string, language: string): Promise<void> {
    const dir = this.resolveLanguageDir(sistema, language);

    try {
      await fs.access(dir);
      throw new Error(`Language '${language}' already exists`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
    }

    await fs.mkdir(dir, { recursive: true });
  }

  async deleteLanguage(sistema: string, language: string): Promise<void> {
    const dir = this.resolveLanguageDir(sistema, language);

    try {
      await fs.access(dir);
    } catch {
      throw new Error(`Language '${language}' does not exist`);
    }

    await fs.rm(dir, {
      recursive: true,
      force: false,
    });
  }

  async saveKey(entry: CatalogEntry, key: string, value: any) {
    const filePath = this.resolvePath(entry);

    const data = await this.load(entry);

    if (key in data) {
      throw new BadRequestException(`Key '${key}' already exists`);
    }

    data[key] = value;

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async deleteKey(entry: CatalogEntry, key: string): Promise<void> {
    const filePath = this.resolvePath(entry);

    try {
      const data = await this.load(entry);

      if (!(key in data)) {
        return;
      }

      delete data[key];

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // arquivo não existe → ignora
    }
  }

  async listNamespaces(sistema: string, language: string): Promise<string[]> {
    const dir = this.resolveLanguageDir(sistema, language);

    const files = await fs.readdir(dir);

    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  }

  async createNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const filePath = this.resolveNamespacePath(sistema, language, namespace);

    // se já existe → erro explícito
    try {
      await fs.access(filePath);
      throw new Error(`Namespace '${namespace}' already exists`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    await fs.writeFile(filePath, JSON.stringify({}, null, 2), 'utf-8');
  }

  async deleteNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const filePath = this.resolveNamespacePath(sistema, language, namespace);

    try {
      await fs.unlink(filePath);
    } catch {
      throw new BadRequestException(`Namespace #${namespace} does not exist`);
    }
  }

  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
  private resolvePath({ sistema, language, namespace }: CatalogEntry) {
    return path.join(this.basePath, sistema, language, `${namespace}.json`);
  }
  private resolveNamespacePath(sistema: string, language: string, namespace: string) {
    return path.join(this.basePath, sistema, language, `${namespace}.json`);
  }

  private resolveLanguageDir(sistema: string, language: string): string {
    return join(this.basePath, sistema, language);
  }
}
