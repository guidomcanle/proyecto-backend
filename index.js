const express = require("express");
const { Router } = express;
const ContenedorCarrito = require("./contenedorCarrito");
const contenedorCarrito = new ContenedorCarrito("./contenedorCarrito.json");

const ContenedorMariaDB = require("./containerMariaDB");
const ChatMemorieSqlite = require("./chatMemorieSqlite");
const contenedor = new ContenedorMariaDB();
const chatMemorie = new ChatMemorieSqlite();

// const ChatMemorie = require("./chatMemorie");
// const Contenedor = require("./container");
// const contenedor = new Contenedor("./productos.json");
// const chatMemorie = new ChatMemorie("./chatMemorie.json");

const app = express();
const router = Router();

app.use("/", express.static(__dirname + "/producto"));

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
    console.log(msg);
    await chatMemorie.saveHistorial(msg);
    io.sockets.emit("messages", await chatMemorie.getHistorial());
  });

  io.sockets.emit("requestBooks", await contenedor.getAll());
  socket.on("newBook", async (book) => {
    await contenedor.save(book);
    io.sockets.emit("prodList", await contenedor.getAll());
  });
});

// El servidor funcionando en el puerto
httpServer.listen(8080, () =>
  console.log("Servidor corriendo en http://localhost:8080")
);

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
  .post(async (requerido, respuesta) => {
    const nuevoProducto = requerido.body;
    await contenedor.save(nuevoProducto);
    respuesta.redirect("/api/productos");
  });

router
  .route("/productos/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;

    // No funciona este if, arreglar
    if (id) {
      respuesta.send(await contenedor.getById(id));
    } else {
      respuesta.send({ error: "El producto no existe" });
    }
  })
  .put(async (requerido, respuesta) => {
    const id = Number(requerido.params.id);
    const nombre = String(requerido.body.nombre);
    const precio = Number(requerido.body.precio);
    const foto = String(requerido.body.foto);
    const descripcion = String(requerido.body.descripcion);
    const código = Number(requerido.body.código);
    const stock = Number(requerido.body.stock);
    await contenedor.updateProduct(
      id,
      nombre,
      descripcion,
      código,
      foto,
      precio,
      stock
    );
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
