import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'mykey',
});

async function run() {
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: 'Explique o padrão Repository em poucas palavras',
  });

  const texts = response.output
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content.filter((c) => c.type === 'output_text').map((c) => c.text));

  console.log(texts.join('\n'));
}

run();
