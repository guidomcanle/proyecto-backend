const express = require("express");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  socket.emit("mi mensaje", "este es mi mensaje del servidor");
  socket.on("notification", (data) => {
    console.log(data);
  });
});

// El servidor funcionando en el puerto 3000
httpServer.listen(8080, () =>
  console.log("Servidor corriendo en http://localhost:8080")
);

const messages = [
  { author: "Juan", text: "¡Hola! ¿Que tal?" },
  { author: "Pedro", text: "¡Muy bien! ¿Y vos?" },
  { author: "Ana", text: "¡Genial!" },
];

io.on("connection", function (socket) {
  console.log("Un cliente se ha conectado");
  socket.emit("messages", messages);
});
