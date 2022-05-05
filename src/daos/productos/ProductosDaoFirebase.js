const ContenedorFirebase = require("../../ContenedorFirebase");
const productosSchema = require("../models/products.model");

class ProductosFirebase extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

module.exports = ProductosFirebase;
