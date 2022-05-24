const express = require("express");
const router = require("./src/routes/routes");
const session = require("express-session");

// const ChatMemorieSqlite = require("./chatMemorieSqlite");
// const chatMemorie = new ChatMemorieSqlite();
// const ChatMemorie = require("./chatMemorie");
// const Contenedor = require("./container");
// const contenedor = new Contenedor("./productos.json");
// const chatMemorie = new ChatMemorie("./chatMemorie.json");

const app = express();

app.use("/", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", router);

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const async = require("hbs/lib/async");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// io.on("connection", async (socket) => {
//   console.log("User Connected");
//   io.sockets.emit("requestChat", await chatMemorie.getHistorial());
//   socket.on("newMessage", async (msg) => {
//     console.log(msg);
//     await chatMemorie.saveHistorial(msg);
//     io.sockets.emit("messages", await chatMemorie.getHistorial());
//   });

//   io.sockets.emit("requestBooks", await contenedor.getAll());
//   socket.on("newBook", async (book) => {
//     await contenedor.save(book);
//     io.sockets.emit("prodList", await contenedor.getAll());
//   });
// });

// El servidor funcionando en el puerto
httpServer.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});

// Para ejs
app.set("view engine", "ejs");
