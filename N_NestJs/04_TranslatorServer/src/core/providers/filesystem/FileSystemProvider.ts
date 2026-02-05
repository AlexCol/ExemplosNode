import { promises as fs } from 'fs';
import path from 'path';
import { CatalogEntry, Environment } from '../../contracts/Types';
import { BadRequestException } from '@nestjs/common';
import { Provider } from '../../contracts/Provider';

export class FileSystemProvider implements Provider {
  constructor(private readonly basePath: string) {}

  /*****************************************************/
  /* Metodos da Interface                              */
  /*****************************************************/
  async load(catalogo: CatalogEntry) {
    const { env, sistema, language, namespace } = catalogo;
    const filePath = path.join(this.basePath, env, sistema, language, `${namespace}.json`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  async listLanguages(env: Environment, sistema: string): Promise<string[]> {
    const systemPath = path.join(this.basePath, env, sistema);
    const entries = await fs.readdir(systemPath, { withFileTypes: true });

    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  async createLanguage(sistema: string, language: string): Promise<void> {
    const dir = this.resolveLanguageDir('dev', sistema, language);

    try {
      await fs.access(dir);
      throw new Error(`Language '${language}' already exists`);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
    }

    await fs.mkdir(dir, { recursive: true });
  }

  async deleteLanguage(sistema: string, language: string): Promise<void> {
    const dir = this.resolveLanguageDir('dev', sistema, language);

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
    entry.env = 'dev';
    const filePath = this.resolvePath(entry);

    const data = await this.load(entry);

    if (key in data) {
      if (data[key] === value) {
        throw new BadRequestException(`Key '${key}' already has the same value`);
      }
    }

    data[key] = value;

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async deleteKey(entry: CatalogEntry, key: string): Promise<void> {
    entry.env = 'dev';
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

  async listNamespaces(env: Environment, sistema: string, language: string): Promise<string[]> {
    const dir = this.resolveLanguageDir(env, sistema, language);

    const files = await fs.readdir(dir);

    return files.filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
  }

  async createNamespace(sistema: string, language: string, namespace: string): Promise<void> {
    const filePath = this.resolveNamespacePath('dev', sistema, language, namespace);

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
    const filePath = this.resolveNamespacePath('dev', sistema, language, namespace);

    try {
      await fs.unlink(filePath);
    } catch {
      throw new BadRequestException(`Namespace #${namespace} does not exist`);
    }
  }

  async publishEnvironment(sistema: string, from: 'dev', to: 'prod'): Promise<void> {
    const sourcePath = path.join(this.basePath, from, sistema);
    const targetPath = path.join(this.basePath, to, sistema);

    // 1. Limpar target recursivamente
    await this.deleteDirectoryRecursive(targetPath);

    // 2. Copiar tudo de source para target (recursivo)
    await this.copyDirectoryRecursive(sourcePath, targetPath);
  }

  /*****************************************************/
  /* Metodos da Privados                               */
  /*****************************************************/
  private resolvePath({ env, sistema, language, namespace }: CatalogEntry) {
    return path.join(this.basePath, env, sistema, language, `${namespace}.json`);
  }
  private resolveNamespacePath(env: string, sistema: string, language: string, namespace: string) {
    return path.join(this.basePath, env, sistema, language, `${namespace}.json`);
  }

  private resolveLanguageDir(env: Environment, sistema: string, language: string): string {
    return path.join(this.basePath, env, sistema, language);
  }

  private async deleteDirectoryRecursive(dirPath: string): Promise<void> {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch {
      // diretório não existe, ok
    }
  }

  private async copyDirectoryRecursive(source: string, target: string): Promise<void> {
    await fs.mkdir(target, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectoryRecursive(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }
}
