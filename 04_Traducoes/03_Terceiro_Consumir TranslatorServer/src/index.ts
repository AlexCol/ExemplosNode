import express from 'express';
import { dicionario, formatTranslation, loadDicionario } from './translations';
import { Langs } from './translations/types';

async function bootstrap() {
  await loadDicionario();

  const app = express();

  app.get('', (req, res) => {
    const lang = (req.query.lang as Langs) || 'pt-BR';
    res.json({
      mensagem: dicionario[lang].usuarios['Bem-vindo, {{name}}'],
      com_formato: formatTranslation(dicionario[lang].usuarios['Bem-vindo, {{name}}'], { name: 'João' }),
      chave_fallback: dicionario[lang].usuarios['Bem-vindo, {{name}}'],
    });
  });

  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

bootstrap();
