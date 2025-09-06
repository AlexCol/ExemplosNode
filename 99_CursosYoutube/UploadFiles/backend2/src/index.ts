import express from "express";
import http from "http";

import router from "./rotas";
import addSocketIo from "./socket";
import { logger } from "./util";

async function main() {
  const app = express();
  const server = http.createServer(app);
  addSocketIo({ server, app });

  app.use(express.json());
  app.use(router);

  server.listen(3000, () => logger.info("Server running at http://localhost:3000"));
}

main();
