const express = require("express");
const { Router } = express;
const Contenedor = require("./container");
const ContenedorCarrito = require("./contenedorCarrito");
const ChatMemorie = require("./chatMemorie");
const contenedor = new Contenedor("./productos.json");
const contenedorCarrito = new ContenedorCarrito("./contenedorCarrito.json");
const chatMemorie = new ChatMemorie("./chatMemorie.json");

// const handlebars = require("express-handlebars");

const app = express();
const router = Router();

app.use("/", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const async = require("hbs/lib/async");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", async (socket) => {
  console.log("User Connected");
  io.sockets.emit("requestChat", await chatMemorie.getHistorial());
  socket.on("newMessage", async (msg) => {
    await chatMemorie.saveHistorial(msg);
    io.sockets.emit("messages", await chatMemorie.getHistorial());
  });

  io.sockets.emit("requestBooks", await contenedor.getAll());
  socket.on("newBook", async (book) => {
    await contenedor.save(book);
    io.sockets.emit("prodList", await contenedor.getAll());
  });
});

// El servidor funcionando en el puerto 3000
httpServer.listen(8080, () =>
  console.log("Servidor corriendo en http://localhost:8080")
);

// Código como si usara el hbs
// app.engine(
//   "hbs",
//   handlebars.engine({
//     extname: ".hbs",
//     defaultLayout: "index.hbs",
//     layoutsDir: __dirname + "/hbs/views/layouts",
//     partialsDir: __dirname + "/hbs/views/partials",
//   })
// );
// app.set("view engine", "hbs");
// app.set("views", "./hbs/views");

// Código como si usara el pug
// app.set("view engine", "pug");
// app.set("views", "./pug/views");

// Para ejs
app.set("view engine", "ejs");

router.route("/").get((requerido, respuesta) => {
  respuesta.send("<h1>Bienvenido</h1>");
});

router
  .route("/productos")
  .get(async (requerido, respuesta) => {
    respuesta.render("pages/index", {
      productosArray: await contenedor.getAll(),
    });
  })
  // Código como si usara el hbs
  // .get(async (requerido, respuesta) => {
  //   respuesta.render("main", { productosArray: await contenedor.getAll() });
  // })

  // Código como si usara el pug
  // .get(async (requerido, respuesta) => {
  //   respuesta.render("indexInPug", {
  //     productosArray: await contenedor.getAll(),
  //   });
  // })
  .post(async (requerido, respuesta) => {
    const nuevoProducto = requerido.body;
    await contenedor.save(nuevoProducto);
    respuesta.redirect("/api/productos");
  });

router
  .route("/productos/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;

    if (id != true) {
      respuesta.send(await contenedor.getById(id));
    } else {
      respuesta.send({ error: "El producto no existe" });
    }
  })
  .put(async (requerido, respuesta) => {
    const id = Number(requerido.params.id);
    const nombre = String(requerido.body.title);
    const precio = Number(requerido.body.price);
    const foto = String(requerido.body.thumbnail);
    await contenedor.updateProduct(id, nombre, precio, foto);
    respuesta.send(contenedor);
  })
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const arrayNuevo = await contenedor.deleteById(id);

    respuesta.send({ nuevoArray: arrayNuevo });
  });

router
  .route("/carrito")
  .get(async (requerido, respuesta) => {
    respuesta.send(await contenedorCarrito.getAll());
  })
  .post(async (requerido, respuesta) => {
    respuesta.send(await contenedorCarrito.crearCarrito());
  });

router.route("/carrito/:id").delete(async (requerido, respuesta) => {
  const id = requerido.params.id;
  const arrayNuevo = await contenedorCarrito.deleteCarritoById(id);

  respuesta.send({ nuevoArray: arrayNuevo });
});

router
  .route("/carrito/:id/productos")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;
    respuesta.send(await contenedorCarrito.getCarritoById(id));
  })
  .post(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const idProd = requerido.body.idProd;
    const prod = await contenedor.getById(idProd);
    respuesta.send(await contenedorCarrito.addProdInCarById(id, prod));
  });

router
  .route("/carrito/:id/productos/:id_prod")
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const idProd = requerido.params.id_prod;

    if (id == true) {
      respuesta.send(await contenedorCarrito.deleteProdinCarById(id, idProd));
    } else {
      respuesta.send({ error: "El carrito no existe 3" });
    }
  });

router.route("/productoRandom").get(async (requerido, respuesta) => {
  const productosArray = await contenedor.getAll();
  const random = Math.floor(Math.random() * productosArray.length);

  respuesta.send(productosArray[random]);
});

// app.get("*", function (req, res) {
//   res.send("what???", 404);
// });

app.use("/api", router);
