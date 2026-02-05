import fs from 'fs/promises';
import path from 'path';

export async function generateEstrutura(languages: string[], namespaces: string[]) {
  const outputPath = path.resolve(process.cwd(), 'src/translations/types/estrutura.ts');

  const langsUnion = languages.map((l) => `'${l}'`).join(' | ');
  const langsArray = languages.map((l) => `'${l}'`).join(', ');

  const nsUnion = namespaces.map((n) => `'${n}'`).join(' | ');
  const nsArray = namespaces.map((n) => `'${n}'`).join(', ');

  const translationFields = namespaces.map((ns) => `  ${ns}: typeof import('./../jsons/${ns}.json');`).join('\n');

  const content = `/* eslint-disable */
// ⚠️ Arquivo gerado automaticamente
// NÃO EDITE MANUALMENTE

export type Langs = ${langsUnion};
export const LangsList: Langs[] = [${langsArray}];

export type Namespace = ${nsUnion};
export const NamespacesList: Namespace[] = [${nsArray}];

export interface Translation {
${translationFields}
}
`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf-8');
  console.log(`✔ Arquivo estrutura.ts gerado/atualizado.`);
}
