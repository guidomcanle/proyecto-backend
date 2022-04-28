const fs = require("fs");

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async findAll() {
    try {
      const data = await fs.readFile(this.ruta);
      return JSON.parse(data);
    } catch (e) {
      return e;
    }
  }

  async findById(id) {
    const data = await this.findAll();
    const objById = data.find((o) => o.id == id);
    return objById;
  }

  async deleteById(id) {
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
      console.log(e + "Error en save");
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

module.exports = ContenedorArchivo;
