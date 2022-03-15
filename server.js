const express = require("express");
const req = require("express/lib/request");
const { Router } = express;

const Contenedor = require("./CanleGuido-desafio");

const contenedor = new Contenedor("./productos.json");

const app = express();
const router = Router();

app.use("/static", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.route("/").get((requerido, respuesta) => {
  respuesta.send("<h1>Bienvenido</h1>");
});

router
  .route("/productos")
  .get(async (requerido, respuesta) => {
    const productosArray = await contenedor.getAll();

    respuesta.send(productosArray);
  })
  .post(async (requerido, respuesta) => {
    const nuevoProducto = requerido.body;
    const productosArray = await contenedor.getAll();

    const productoConId = await contenedor.save(nuevoProducto);
    productosArray.push(productoConId);

    respuesta.send({ produtoAgregado: productoConId });
  });

router
  .route("/productos/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const productosArray = await contenedor.getAll();

    if (id > productosArray.length) {
      respuesta.send({ error: "El producto no existe" });
      return;
    } else if (id <= 0) {
      respuesta.send({ error: "El producto no existe" });
      return;
    }

    respuesta.send(productosArray[id - 1]);
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
    const productosArray = await contenedor.getAll();

    const arrayNuevo = await contenedor.deleteById(id);
    productosArray.replace(arrayNuevo);

    respuesta.send({ nuevoArray: productosArray });
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
