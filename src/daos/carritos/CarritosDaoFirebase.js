const ContenedorFirebase = require("../../ContenedorFirebase");
const carritosSchema = require("../models/cart.model");

class CarritosFirebase extends ContenedorFirebase {
  constructor() {
    super("carritos", carritosSchema);
  }
}

module.exports = CarritosFirebase;
