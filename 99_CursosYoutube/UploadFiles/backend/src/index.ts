import express from "express";
import http from "http";
import router from "./rotas";
import addSocket from "./socket";

async function main() {
  const app = express();

  // cria o servidor http a partir do express
  const server = http.createServer(app);
  const io = addSocket(server);
  app.set("io", io); // disponibiliza o io para as rotas

  app.use(router);

  // inicia o servidor http
  server.listen(3000, () => console.log("Server running at http://localhost:3000"));
}

main();