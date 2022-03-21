const express = require("express");
/*const req = require("expressnp/lib/request");*/
const { Router } = express;
const handlebars = require("express-handlebars");

const Contenedor = require("./container");

const contenedor = new Contenedor("./productos.json");

const app = express();
const router = Router();

app.use("/static", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
// // app.set("view engine", "pug");
// app.set("view engine", "ejs");
app.set("views", "./views");

router.route("/").get((requerido, respuesta) => {
  respuesta.send("<h1>Bienvenido</h1>");
});

router
  .route("/productos")
  .get(async (requerido, respuesta) => {
    respuesta.render("main", { productosArray: await contenedor.getAll() });
    // // respuesta.render("indexInPug", {
    // //   productosArray: await contenedor.getAll(),
    // // });
    // respuesta.render("pages/index", {
    //   productosArray: await contenedor.getAll(),
    // });
  })
  .post(async (requerido, respuesta) => {
    const nuevoProducto = requerido.body;

    await contenedor.save(nuevoProducto);

    respuesta.redirect(__dirname + "/static");
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
