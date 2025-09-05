const socketIo = require("socket.io");
import http from "http";
import { DefaultEventsMap, Server as SocketIOServer } from "socket.io";

export default function addSocket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  // cria o socket.io em cima do servidor http
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      credentials: false,
    },
  });

  addEvents(io);
  addEmits(io);

  return io;
}

function addEvents(io: SocketIOServer) {
  //quando alguém conectar
  io.on("connection", (socket) => {
    console.log("New client connected");
  });
}

function addEmits(io: SocketIOServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
  // const interval = setInterval(() => {
  //   io.emit('file-uploaded', 5e6); // 5MB
  // }, 1000);
}