import { OUTPUT_DIR } from '../constants';
import path from 'path';
import { ensureDir } from './ensureDir';
import fs from 'fs/promises';
import { fetchNamespaceJson } from './fetchNamespaceJson';

export async function saveJsons(languages: string[], namespaces: string[]) {
  for (const lang of languages) {
    if (lang.trim() !== 'pt-BR') continue;

    //const langDir = path.join(OUTPUT_DIR, lang);
    const langDir = path.join(OUTPUT_DIR);
    await ensureDir(langDir);

    const promises: Promise<void>[] = [];
    for (const ns of namespaces) {
      promises.push(saveFile(langDir, lang, ns));
    }
    await Promise.all(promises);
  }
}

async function saveFile(langDir: string, lang: string, ns: string) {
  const json = await fetchNamespaceJson(lang, ns);
  const filePath = path.join(langDir, `${ns}.json`);

  await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

  console.log(`✔ ${lang}/${ns}.json`);
}
