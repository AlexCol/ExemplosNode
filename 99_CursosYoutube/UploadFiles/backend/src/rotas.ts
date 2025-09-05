import { Request, Response, Router } from "express";
import { Server } from "socket.io";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send("Hello from rotas.ts");
});

router.post('/upload', (req: Request, res: Response) => {
  const io = req.app.get("io") as Server; // pega o io (adicionado na main)
  const { origin } = req.headers;
  const socketId = req.query.socketId as string | undefined;

  if (socketId) {
    // emite várias vezes, mas pode ser feito em loop
    for (let i = 0; i < 4; i++) {
      io.to(socketId).emit("file-uploaded", 5e9);
    }
  }

  // redireciona após 2 segundos
  setTimeout(() => {
    res.redirect(303, `${origin}?msg=Files uploaded with success!`);
  }, 2000);
});

export default router;