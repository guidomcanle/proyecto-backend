const express = require("express");

// const ContenedorMariaDB = require("./containerMariaDB");
// const ChatMemorieSqlite = require("./chatMemorieSqlite");
// const contenedor = new ContenedorMariaDB();
// const chatMemorie = new ChatMemorieSqlite();

const router = require("./src/routes/routes");

// const ChatMemorie = require("./chatMemorie");
// const Contenedor = require("./container");
// const contenedor = new Contenedor("./productos.json");
// const chatMemorie = new ChatMemorie("./chatMemorie.json");

// const admin = require("firebase-admin");
// const serviceAccount = require("./proyecto-backend-48732-firebase-adminsdk-2qneu-136b2d954d.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://proyecto-backend-48732.firebaseio.com",
// });

const app = express();

app.use("/", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.get("*", function (req, res) {
//   res.send("what???", 404);
// });

app.use("/api", router);
