const { Router } = require("express");
const router = Router();
const session = require("express-session");

// const ContenedorMariaDB = require("../../containerMariaDB");
// const contenedor = new ContenedorMariaDB();
// const ContenedorCarrito = require("../../contenedorCarrito");
// const contenedorCarrito = new ContenedorCarrito("../contenedorCarrito.json");
const ContenedorCarrito = require("../daos/carritos/CarritosDatoMongoDb");
const contenedorCarrito = new ContenedorCarrito();
const ContenedorMongoDb = require("../daos/productos/ProductosDaoMongoDb");
const contenedor = new ContenedorMongoDb();
const ProdController = require("../controller/prod.controller");
const prodController = new ProdController();

router.route("/").get((requerido, respuesta) => {
  respuesta.send("<h1>Bienvenido</h1>");
});

router
  .route("/productos-test")
  .post(async (req, res) => {
    try {
      res.json({ creados: await prodController.createProds() });
    } catch (e) {
      console.log(e);
    }
  })
  .get(async (req, res) => {
    try {
      res.json({ productos: await prodController.getProds() });
    } catch (e) {
      console.log(e);
    }
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
    console.log(id);

    // No funciona este if, arreglar
    const prod = await contenedor.getById(requerido.params.id);
    console.log(prod);
    if (prod != null) {
      respuesta.json({ producto: await contenedor.getById(id) });
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
    respuesta.json({ carritoCreado: await contenedorCarrito.save() });
  })
  .delete(async (requerido, respuesta) => {
    respuesta.json({ borrado: await contenedorCarrito.deleteAll() });
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
    //if no funciona
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
  .post(async (requerido, respuesta) => {
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const prod = await contenedor.getById(requerido.body.idProd);
    // No funciona el if
    if (
      prod._id.valueOf() === requerido.body.idProd &&
      cart._id.valueOf() === requerido.params.id
    ) {
      await cart.productos.push(prod);
      respuesta.json({
        productoAgregado: await contenedorCarrito.update(cart._id, cart),
      });
    } else {
      respuesta.json("No se pudo actualizar el carrito");
    }
  })
  .delete(async (requerido, respuesta) => {
    const cart = await contenedorCarrito.getById(requerido.params.id);
    const prodIndex = cart.productos.findIndex(
      (p) => p._id.valueOf() === requerido.body.idProd
    );
    if (prodIndex != -1) {
      cart.productos.splice(prodIndex, 1);
      respuesta.json({
        nuevoArray: await contenedorCarrito.update(cart._id, cart),
      });
    } else {
      respuesta.json({
        error: "El carrito no existe o el producto no está en el carrito",
      });
    }
  });

router.route("/carrito/:id/productos/:id_prod");

router
  .route("/login")
  .get(async (requerido, respuesta) => {
    if (typeof user === "undefined") {
      user = "invitado";
    }
    console.log(user);
    respuesta.render("pages/login", { user: user });
  })
  .post(async (req, res) => {
    try {
      const { user, password } = req.body;
      console.log(user);
      console.log(password);
      if (user != "juan" || password != "123456") {
        return res.json("Error");
      }
      req.session.username = user;
      res.redirect("/api/privado");
    } catch (err) {
      console.log(err);
    }
  });

router.route("/logout").post(async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (!err) {
        user = "deslogueado";
        res.redirect("/api/login");
      } else res.send("error");
    });
  } catch (err) {
    console.log(err);
  }
});

router.route("/privado").get(async (req, res) => {
  if (!req.session.username) {
    res.redirect("/api/login");
  } else {
    res.render("pages/privado", { user: req.session.username });
  }
});

module.exports = router;
