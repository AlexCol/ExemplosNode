import busboy from "busboy";
import { Router } from "express";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Server } from "socket.io";
import { pipeline } from "stream/promises";
import { logger } from "./util";

const router = Router();

// Rota GET de teste
router.get('/', (_, res) => res.send("Hello from rotas.ts"));

// Rota POST para upload de arquivos
router.post('/upload', async (req, res) => {
  // Recupera o servidor Socket.IO configurado na aplicação
  const io = req.app.get("io") as Server;

  // Pega o socketId do query params enviado pelo cliente
  const socketId = req.query.socketId as string | undefined;

  // Pega o header "origin" para redirecionamento pós-upload
  const origin = req.headers.origin as string;

  // Validação mínima: precisa de socketId e origin
  if (!socketId || !origin) return res.status(400).send("socketId and origin required");

  // Valida se o request é multipart/form-data (necessário para upload de arquivos)
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) return res.status(400).send("No files uploaded");

  // Cria o parser do Busboy para processar o upload
  const bb = busboy({ headers: req.headers });
  let hasFile = false; // flag para verificar se veio algum arquivo

  // Define o diretório de upload e garante que exista
  const uploadDir = join(__dirname, '../download');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  // Evento disparado para cada arquivo enviado
  bb.on('file', async (_, file, info) => {
    // Se o arquivo não tiver nome, ignora
    if (!info.filename) return file.resume();

    hasFile = true;
    const savePath = join(uploadDir, info.filename); // caminho completo para salvar o arquivo
    logger.info(`Uploading ${info.filename}`);

    // Pipeline: processa o stream do arquivo
    await pipeline(
      file,
      // Função geradora para emitir progresso via Socket.IO
      async function* (source) {
        for await (const chunk of source) {
          // Emite o tamanho do chunk recebido para o front-end
          io.to(socketId).emit('file-uploaded', chunk.length);
          yield chunk; // envia o chunk adiante no pipeline
        }
      },
      // Escreve o arquivo no disco
      createWriteStream(savePath)
    );
  });

  // Evento disparado quando todos os arquivos foram processados
  bb.on('finish', () => {
    // Se nenhum arquivo foi enviado, retorna erro
    if (!hasFile) return res.status(400).send("No files uploaded");

    // Redireciona o usuário após 2 segundos com mensagem de sucesso
    setTimeout(() => res.redirect(303, `${origin}?msg=Files uploaded with success!`), 2000);
  });

  // Conecta o request ao Busboy para iniciar o processamento
  req.pipe(bb);
});

export default router;
