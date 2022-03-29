const fs = require("fs");

class ChatMemorie {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
  }

  async getHistorial() {
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

  async saveHistorial(message) {
    let info = await this.getHistorial();

    info.push(message);
    try {
      fs.promises.writeFile(this.rutaArchivo, JSON.stringify(info, null, 2));
      console.log("hecho");
    } catch (error) {
      console.log("Error en save");
    }
  }
}

module.exports = ChatMemorie;
