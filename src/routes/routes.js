const { Router } = require("express");
const router = Router();

// const ContenedorMariaDB = require("../../containerMariaDB");
// const contenedor = new ContenedorMariaDB();

// const ContenedorCarrito = require("../../contenedorCarrito");
// const contenedorCarrito = new ContenedorCarrito("../contenedorCarrito.json");

// const ContenedorCarrito = require("../daos/carritos/CarritosDatoMongoDb");
// const contenedorCarrito = new ContenedorCarrito();
// const ContenedorMongoDb = require("../daos/productos/ProductosDaoMongoDb");
// const contenedor = new ContenedorMongoDb();

const ContenedorCarrito = require("../daos/carritos/CarritosDaoFirebase");
const contenedorCarrito = new ContenedorCarrito();
const ContenedorMongoDb = require("../daos/productos/ProductosDaoFirebase");
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
    respuesta.json({ eliminado: await contenedor.deleteAll() })
  );

router
  .route("/productos/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;

    // No funciona este if, arreglar
    if (id) {
      respuesta.json({ productos: await contenedor.getById(id) });
    } else {
      respuesta.json({ error: "El producto no existe" });
    }
  })
  .put(async (requerido, respuesta) => {
    const id = String(requerido.params.id);
    const title = String(requerido.body.title);
    const price = Number(requerido.body.price);
    const thumbnail = String(requerido.body.thumbnail);
    const description = String(requerido.body.description);
    const stock = Number(requerido.body.stock);
    respuesta.json({
      producto: await contenedor.update(id, {
        title,
        description,
        thumbnail,
        price,
        stock,
      }),
    });
  })
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    respuesta.json({ nuevoArray: await contenedor.deleteById(id) });
  });

router
  .route("/carrito")
  .get(async (requerido, respuesta) => {
    respuesta.json({ carritos: await contenedorCarrito.getAll() });
  })
  .post(async (requerido, respuesta) => {
    const productos = [];
    const createdAt = Date.now();

    respuesta.json(
      await contenedorCarrito.save({
        productos: productos,
        createdAt: createdAt,
      })
    );
  })
  .delete(async (requerido, respuesta) => {
    respuesta.json(await contenedorCarrito.deleteAll());
  });

router
  .route("/carrito/:id")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;
    console.log(await contenedorCarrito.getById(id));
    if (await contenedorCarrito.getById(id)) {
      respuesta.json({ carrito: await contenedorCarrito.getById(id) });
    } else {
      respuesta.json({
        error: "El carrito no existe",
      });
    }
  })
  .delete(async (requerido, respuesta) => {
    const id = requerido.params.id;
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const arrayNuevo = await contenedorCarrito.deleteById(id);
    console.log(cart);
    console.log(arrayNuevo);
    if (cart) {
      respuesta.json({ carritoBorrado: arrayNuevo });
    } else {
      respuesta.json({
        error: "El carrito no existe",
      });
    }
  });

router
  .route("/carrito/:id/productos")
  .get(async (requerido, respuesta) => {
    const id = requerido.params.id;
    console.log(await contenedorCarrito.getById(id));
    if (id) {
      respuesta.json({
        productosEnElCarrito: await contenedorCarrito.getById(id),
      });
    } else {
      respuesta.json({
        error: "El carrito no existe",
      });
    }
  })
  //Este funciona en Firebase
  .post(async (requerido, respuesta) => {
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const prod = await contenedor.getById(requerido.body.idProd);

    const prodWithId = { ...prod, id: requerido.body.idProd };
    console.log(prodWithId);
    console.log(cart);
    console.log(prod);

    if (prod) {
      await cart.productos.push(prodWithId);
      respuesta.json({
        productoAgregado: await contenedorCarrito.update(
          requerido.params.id,
          cart
        ),
      });
    } else {
      respuesta.json({
        error: "El producto o el carrito no existen",
      });
    }
  })
  //Firebase
  .delete(async (requerido, respuesta) => {
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const prodIndex = cart.productos.findIndex(
      (p) => p.id.valueOf() === requerido.body.idProd
    );

    cart.productos.splice(prodIndex, 1);

    if (prodIndex != -1) {
      cart.productos.splice(prodIndex, 1);
      respuesta.json({
        productoEliminado: await contenedorCarrito.update(
          requerido.params.id,
          cart
        ),
      });
    } else {
      respuesta.json({
        error: "El carrito no existe o el producto no está en el carrito",
      });
    }
  });

router.route("/carrito/:id/productos/:id_prod");

module.exports = router;
