const ContenedorMongoDb = require("../../ContenedorMongoDb");
const carritosSchema = require("../models/cart.model");

class CarritosMongoDB extends ContenedorMongoDb {
  constructor() {
    super("carritos", carritosSchema);
  }
}

module.exports = CarritosMongoDB;
