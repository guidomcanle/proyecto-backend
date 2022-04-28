const ContenedorMongoDb = require("../../ContenedorMongoDb");

class ProductosMongoDB extends ContenedorMongoDb {
  constructor() {
    super("productos", ProductosSchema);
  }

  async saveProds(prods) {
    return await this.collection.insertMany(prods);
  }

  async updateProduct() {}

  async desconectar() {}
}

module.exports = ProductosMongoDB;
