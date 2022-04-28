const ContenedorMongoDb = require("../../ContenedorMongoDb");

class CarritosMongoDB extends ContenedorMongoDb {
  constructor() {
    super("carritos", CarritosSchema);
  }

  async createCarrito() {}

  async addProdIncar() {}

  async deleteProdInCarById(id, idProd) {}
}

module.exports = CarritosMongoDB;
