import { fetchLanguages, fetchNamespaces, generateEstrutura, saveJsons } from './utils';

async function loadTranslations() {
  console.log('🔄 Carregando traduções...');
  const [languages, namespaces] = await Promise.all([fetchLanguages(), fetchNamespaces()]);
  await saveJsons(languages, namespaces);
  await generateEstrutura(languages, namespaces);
  console.log('✅ Traduções carregadas com sucesso');
}

loadTranslations().catch((err) => {
  console.error('❌ Erro ao carregar traduções');
  console.error(err);
  process.exit(1);
});
