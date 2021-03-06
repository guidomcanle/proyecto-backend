const fs = require("fs");

class Contenedor {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
  }

  //Usuario común
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
  async getById(id) {
    let info = await this.getAll();
    let arrayById = await info.filter((info) => info.id === Number(id));
    let productoById = arrayById[0];
    return productoById;
  }

  //Administrador
  async save({ nombre, descripcion, código, foto, precio, stock }) {
    let info = await this.getAll();
    let infoOnlyId = info.map((info) => info.id);
    let topNumber = Math.max(...infoOnlyId);
    if (topNumber == "-Infinity") {
      let id = 1;
      info.push({
        id: id,
        timestamp: Date.now(),
        nombre,
        descripcion,
        código: parseInt(código),
        foto,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      });
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
      info.push({
        id: id,
        timestamp: Date.now(),
        nombre,
        descripcion,
        código: parseInt(código),
        foto,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      });
      try {
        fs.promises.writeFile(this.rutaArchivo, JSON.stringify(info, null, 2));
        console.log("hecho");
      } catch (error) {
        console.log("Error en save");
      }
      console.log(id);
      return {
        id: id,
        timestamp: Date.now(),
        nombre,
        descripcion,
        código: parseInt(código),
        foto,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      };
    }
  }

  async updateProduct(id, newTitle, newPrice, newThumbnail) {
    let info = await this.getAll();
    const pos = info.findIndex((p) => {
      return p.id == id;
    });
    if (pos !== undefined) {
      const newProd = {
        title: newTitle,
        price: newPrice,
        thumbnail: newThumbnail,
        id: id,
      };
      const del = id - 1;
      info.splice(del, 1, newProd);
      fs.writeFile(this.rutaArchivo, JSON.stringify(info, null, 2), (er) => {
        if (er) {
          return { info: "no se pudo modificar el archivo" };
        } else {
          return { info: "Producto modificado" };
        }
      });
    } else {
      console.log("Error");
    }
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

module.exports = Contenedor;
