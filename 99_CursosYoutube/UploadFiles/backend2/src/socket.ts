import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

type addSocketIoParams = {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  app: express.Express;
}

function addSocketIo({ server, app }: addSocketIoParams) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*", credentials: false },
  });
  app.set("io", io); // Disponibiliza o io para outras partes da aplicação

  io.on("connection", (socket) => {
    console.log("New client connected");
    console.log(`Total clients: ${io.engine.clientsCount}`);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      console.log(`Total clients: ${io.engine.clientsCount}`);
    });
  });
}

export default addSocketIo;