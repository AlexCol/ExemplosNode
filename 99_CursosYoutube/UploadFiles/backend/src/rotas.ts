import { Request, Response, Router } from "express";
import { Server } from "socket.io";
import UploadHandler from "./uploadHandler";
import { logger, pipelineAsync } from "./util";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send("Hello from rotas.ts");
});

router.post('/upload', async (req: Request, res: Response) => {
  try {
    const onFinish = (res: Response, origin: string) => () => {
      // redireciona após 2 segundos
      setTimeout(() => {
        res.redirect(303, `${origin}?msg=Files uploaded with success!`);
      }, 2000);
    }

    const io = req.app.get("io") as Server; // pega o io (adicionado na main)
    const { origin } = req.headers;
    const socketId = req.query.socketId as string | undefined;

    if (!origin)
      return res.status(400).send("You need to provide an origin.");
    if (!socketId)
      return res.status(400).send("You need to provide a socketId.");

    const uploadHandler = new UploadHandler(io, socketId);
    const busboyInstance = uploadHandler.registerEvents(req.headers, onFinish(res, origin));

    await pipelineAsync(req, busboyInstance);

    logger.info("Request finished");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error on upload: ${err.message}`);
      res.sendStatus(500);
    }
  }
});

export default router;