const { Router } = require("express");
const router = Router();

const ContenedorMariaDB = require("../../containerMariaDB");
const contenedor = new ContenedorMariaDB();

const ContenedorCarrito = require("../../contenedorCarrito");
const contenedorCarrito = new ContenedorCarrito("../contenedorCarrito.json");

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

module.exports = router;
