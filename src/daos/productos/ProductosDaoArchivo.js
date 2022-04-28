const ContenedorArchivo = require("../../ContenedorArchivo");
const fs = require("fs");

class ProductosDaoArchivo extends ContenedorArchivo {
  constructor() {
    super("../../../productos.json");
  }

  async save({ nombre, descripcion, código, foto, precio, stock }) {
    let info = await this.findAll();
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
    let info = await this.findAll();
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

  async desconectar() {}
}

module.exports = ProductosDaoArchivo;
