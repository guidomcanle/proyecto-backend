const ContenedorArchivo = require("../../ContenedorArchivo");
const fs = require("fs");

class CarritosDaoArchivo extends ContenedorArchivo {
  constructor() {
    super("../../../ChatMemorie.json");
  }

  async crearCarrito() {
    let info = await this.findAll();
    let infoOnlyId = info.map((info) => info.id);
    let topNumber = Math.max(...infoOnlyId);
    const timeStamp = Date.now();
    if (topNumber == "-Infinity") {
      let id = 1;
      info.push({ id: id, timeStamp: timeStamp, productos: [] });
      try {
        await fs.promises.writeFile(
          this.rutaArchivo,
          JSON.stringify(info, null, 2)
        );
        console.log("hecho");
        console.log(info);
      } catch (error) {
        console.log("Error en save");
      }
    } else {
      let id = topNumber + 1;
      info.push({ id: id, timeStamp: timeStamp, productos: [] });
      try {
        await fs.promises.writeFile(
          this.rutaArchivo,
          JSON.stringify(info, null, 2)
        );
        console.log("hecho");
        console.log(info);
      } catch (error) {
        console.log("Error en save");
      }
    }
  }

  async getCarritoById(id) {
    let info = await this.findAll();
    let arrayById = await info.filter((info) => info.id === Number(id));
    let productoById = arrayById[0];
    if (productoById != undefined) {
      return productoById;
    } else {
      return { error: "El carrito no existe" };
    }
  }

  async addProdInCarById(id, prod) {
    let info = await this.getCarritoById(id);
    let arrayProd = info.productos;
    if (arrayProd != undefined) {
      if (prod != null) {
        arrayProd.push(prod);
        let data = await this.findAll();
        let dataAct = data.filter((data) => data.id != id);
        dataAct.push({
          id: parseInt(id),
          timeStamp: info.timeStamp,
          productos: arrayProd,
        });
        try {
          await fs.promises.writeFile(
            this.rutaArchivo,
            JSON.stringify(dataAct, null, 2)
          );
          console.log("hecho");
          console.log(dataAct);
        } catch (error) {
          return { error: "error" };
        }
      } else {
        return { error: "El producto no existe" };
      }
    } else {
      return { error: "El carrito no existe" };
    }
  }

  async deleteProdinCarById(id, idProd) {
    let info = await this.getCarritoById(id);
    let prod = info.productos;
    let arrayWithoutElement = await prod.filter((prod) => prod.id != idProd);
    let data = await this.findAll();
    let dataAct = data.filter((data) => data.id != id);
    dataAct.push({
      id: parseInt(id),
      timeStamp: info.timeStamp,
      productos: arrayWithoutElement,
    });
    try {
      await fs.promises.writeFile(
        this.rutaArchivo,
        JSON.stringify(dataAct, null, 2)
      );
      console.log("hecho");
      console.log(dataAct);
    } catch (error) {
      console.log("Error en save");
    }
  }

  async deleteCarritoById(id) {
    let info = await this.findAll();
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

  async desconectar() {}
}

module.exports = CarritosDaoArchivo;
