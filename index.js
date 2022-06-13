const express = require("express");
const router = require("./src/routes/routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedtopology: true };
const cookieParser = require("cookie-parser");
const passport = require("passport");
const config = require("./config");

const app = express();

app.use("/", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGODB_,
      mongoOptions: advancedOptions,
    }),
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.authenticate("session"));

app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
// const { createHash } = require("crypto");

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
// httpServer.listen(8080, () => {
//   console.log("Servidor corriendo en http://localhost:8080");
// });

// Para ejs
app.set("view engine", "ejs");

app.listen(config.PORT, config.HOST, function () {
  console.log(`App listening on http://${config.HOST}:${config.PORT}`);
});
