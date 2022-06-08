const { Router } = require("express");
const router = Router();
const session = require("express-session");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

const ContenedorCarrito = require("../daos/carritos/CarritosDatoMongoDb");
const contenedorCarrito = new ContenedorCarrito();
const ContenedorMongoDb = require("../daos/productos/ProductosDaoMongoDb");
const contenedor = new ContenedorMongoDb();
const ContUsersMongoDB = require("../daos/users/UsersDaoMongoDb");
const userDb = new ContUsersMongoDB();

const ProdController = require("../controller/prod.controller");
const prodController = new ProdController();

const bcrypt = require("bcrypt");

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  userDb.collection.findById(user, done);
});

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    userDb.collection.findOne({ username }, (err, user) => {
      console.log(user);
      if (err) return done(err);
      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }
      const userValid = bcrypt.compareSync(password, user.password);
      if (!userValid) {
        console.log("Invalid Password");
        return done(null, false);
      } else {
        return done(null, user);
      }
    });
  })
);

router
  .route("/login")
  .get(async (requerido, respuesta) => {
    if (typeof user === "undefined") {
      user = "invitado";
    }
    respuesta.render("pages/login", { user: user });
  })
  .post(
    passport.authenticate("login", {
      failureRedirect: "/api/error",
    }),
    async (req, res) => {
      try {
        res.redirect("/api/privado");
      } catch (err) {
        console.log(err);
      }
    }
  );

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

passport.use(
  "singup",
  new LocalStrategy(
    {
      passReqToCallbak: true,
    },
    async (req, username, password, done) => {
      try {
        console.log(username);
        console.log(password);
        const userExist = await userDb.collection.findOne({
          username,
        });
        console.log(userExist);
        if (userExist) {
          console.log("Este nombre de usuario no está disponible");
          return done(null, false);
        }
        console.log(userExist);
        const newUser = {
          username: username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          email: email,
        };
        console.log("user " + newUser);
        const userFinal = await userDb.collection.insertMany(newUser);
        return done(null, userFinal);
      } catch (err) {
        console.log(err);
      }
    }
  )
);

router
  .route("/singup")
  .get(async (requerido, respuesta) => {
    respuesta.render("pages/singup");
  })
  .post(
    passport.authenticate("singup", {
      failureRedirect: "/api/error",
    }),
    async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          res.send("Error en el registro");
        } else {
          res.send("Registrado con éxito");
        }
      } catch (err) {
        console.log(err);
      }
    }
  );
// .post(async (req, res) => {
//   try {
//     const { username, password, mail } = req.body;
//     const newUser = {
//       username: username,
//       password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
//       mail: mail,
//     };

//     await userDb.save(newUser);
//   } catch (err) {
//     console.log(err);
//   }
// });

router.route("/privado").get(async (req, res) => {
  if (!req.user.username) {
    res.redirect("/api/login");
  } else {
    res.render("pages/privado", { user: req.user.username });
  }
});

module.exports = router;
