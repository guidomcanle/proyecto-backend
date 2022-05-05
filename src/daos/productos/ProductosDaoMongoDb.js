const ContenedorMongoDb = require("../../ContenedorMongoDb");
const productosSchema = require("../models/products.model");

class ProductosMongoDB extends ContenedorMongoDb {
  constructor() {
    super("productos", productosSchema);
  }
}

module.exports = ProductosMongoDB;
