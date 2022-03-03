const express = require("express");
const app = express();
const Contenedor = require("./CanleGuido-desafio");

const container = new Contenedor("./productos.json");

app.get("/", (requerido, respuesta) => {
  respuesta.send("<h1>Bienvenido</h1>");
});

app.get("/productos", async (requerido, respuesta) => {
  const productosArray = await container.getAll();

  let list = `<ul></ul>`;
  for (const p of productosArray) {
    list += `<li>${p.title}</li>`;
  }

  respuesta.send(list);
});

app.get("/ProductoRandom", async (requerido, respuesta) => {
  const productosArray = await container.getAll();

  const random = Math.floor(Math.random() * productosArray.length);
  respuesta.send(productosArray[random]);
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
