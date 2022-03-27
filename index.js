const express = require("express");
const { Router } = express;
const handlebars = require("express-handlebars");

const Contenedor = require("./container");

const contenedor = new Contenedor("./productos.json");

const app = express();
const router = Router();

app.use("/static", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    respuesta.redirect("/static");
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
    const title = String(requerido.body.title);
    const price = Number(requerido.body.price);
    const thumbnail = String(requerido.body.thumbnail);

    await contenedor.updateProduct(id, title, price, thumbnail);

    respuesta.send(contenedor);
  })
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const arrayNuevo = await contenedor.deleteById(id);

    respuesta.send({ nuevoArray: arrayNuevo });
  });

router.route("/productoRandom").get(async (requerido, respuesta) => {
  const productosArray = await contenedor.getAll();
  const random = Math.floor(Math.random() * productosArray.length);

  respuesta.send(productosArray[random]);
});

app.use("/api", router);

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
