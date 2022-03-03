const fs = require("fs");

class Contenedor {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.rutaArchivo, "utf-8");
      const info = JSON.parse(data);
      return info;
    } catch (err) {
      console.log("error");
      await fs.promises.writeFile(
        this.rutaArchivo,
        JSON.stringify([], null, 2)
      );
      console.log(`creado un archivo de texto con ruta ${this.rutaArchivo}`);
    }
  }

  async save({ title, price, thumbnail }) {
    let info = await this.getAll();
    let infoOnlyId = info.map((info) => info.id);
    let topNumber = Math.max(...infoOnlyId);

    if (topNumber == "-Infinity") {
      let id = 1;
      info.push({ title, price, thumbnail, id });
      try {
        fs.promises.writeFile(this.rutaArchivo, JSON.stringify(info, null, 2));
        console.log("hecho");
      } catch (error) {
        console.log("Error en save");
      }
      console.log(id);
      return id;
    } else {
      let id = topNumber + 1;
      info.push({ title, price, thumbnail, id });
      try {
        fs.promises.writeFile(this.rutaArchivo, JSON.stringify(info, null, 2));
        console.log("hecho");
      } catch (error) {
        console.log("Error en save");
      }
      console.log(id);
      return id;
    }
  }

  async getById(id) {
    let info = await this.getAll();

    let arrayById = await info.filter((info) => info.id === id);

    let productoById = arrayById[0];

    console.log(productoById);
    return productoById;
  }

  async deleteById(id) {
    let info = await this.getAll();

    let arrayWithoutElement = await info.filter((info) => info.id != id);

    try {
      await fs.promises.writeFile(
        this.rutaArchivo,
        JSON.stringify(arrayWithoutElement, null, 2)
      );
      console.log("hecho");
      console.log(arrayWithoutElement);
    } catch (error) {
      console.log("Error en save");
    }
  }

  async deleteAll() {
    try {
      fs.promises.writeFile(this.rutaArchivo, "[]");
    } catch (err) {
      console.log(err);
    }
  }
}

const productos = new Contenedor("./productos.txt");

const p = {
  title: "Digimon",
  price: 1200,
  thumbnail: "https://www.infobae.com/",
};

module.exports = Contenedor;
