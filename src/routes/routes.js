const { Router } = require("express");
const router = Router();

// const ContenedorMariaDB = require("../../containerMariaDB");
// const contenedor = new ContenedorMariaDB();

// const ContenedorCarrito = require("../../contenedorCarrito");
// const contenedorCarrito = new ContenedorCarrito("../contenedorCarrito.json");

const ContenedorCarrito = require("../daos/carritos/CarritosDatoMongoDb");
const contenedorCarrito = new ContenedorCarrito();

const ContenedorMongoDb = require("../daos/productos/ProductosDaoMongoDb");
const contenedor = new ContenedorMongoDb();

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
  })
  .delete(async (requerido, respuesta) =>
    respuesta.send(await contenedor.deleteAll())
  );

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
    const id = String(requerido.params.id);
    const title = String(requerido.body.title);
    const price = Number(requerido.body.price);
    const thumbnail = String(requerido.body.thumbnail);
    const description = String(requerido.body.description);
    const stock = Number(requerido.body.stock);
    await contenedor.update(id, {
      title,
      description,
      thumbnail,
      price,
      stock,
    });
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
    respuesta.send(await contenedorCarrito.save());
  })
  .delete(async (requerido, respuesta) => {
    respuesta.send(await contenedorCarrito.deleteAll());
  });

router
  .route("/carrito/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;

    respuesta.send(await contenedorCarrito.getById(id));
  })
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const arrayNuevo = await contenedorCarrito.deleteById(id);

    respuesta.send({ nuevoArray: arrayNuevo });
  });

router
  .route("/carrito/:id/productos")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;
    respuesta.send(await contenedorCarrito.getById(id));
  })
  .post(async (requerido, respuesta) => {
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const prod = await contenedor.getById(requerido.body.idProd);
    console.log(pos);
    console.log(prod);
    await cart.productos.push(prod);
    console.log(cart);
    await contenedorCarrito.update(cart._id, cart);
    respuesta.send(await contenedorCarrito.getById(req.params.id));
  });

router
  .route("/carrito/:id/productos/:id_prod")
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const idProd = requerido.params.id_prod;

    if (id == true) {
      respuesta.send(await contenedorCarrito.deleteById(id, idProd));
    } else {
      respuesta.send({ error: "El carrito no existe 3" });
    }
  });

module.exports = router;
