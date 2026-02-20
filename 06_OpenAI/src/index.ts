import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: '',
});

async function run() {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: 'Você é um agente de suporte técnico. Responda as perguntas de forma clara e objetiva.',
      },
      {
        role: 'user',
        content: 'Como posso resetar minha senha?',
      },
    ],
  });

  const texts = response.output
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content.filter((c) => c.type === 'output_text').map((c) => c.text));

  console.log(texts.join('\n'));
}

run();

/*
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `
          Você é um assistente especializado EXCLUSIVAMENTE no sistema ACME ERP.

          REGRAS:
          - Responda apenas sobre funcionalidades, APIs e regras do ACME ERP
          - Se a pergunta não for sobre ACME ERP, responda:
            "Não posso ajudar com esse assunto. Posso auxiliar apenas com o ACME ERP."
          - Não improvise nem especule
          `,
      },
      {
        role: 'user',
        content: 'Como posso resetar minha senha?',
      },
    ],
  });
*/
