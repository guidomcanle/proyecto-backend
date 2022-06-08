const ContenedorMongoDb = require("../../ContenedorMongoDb");
const userSchema = require("../models/user.model");

class ContUsersMongoDB extends ContenedorMongoDb {
  constructor() {
    super("users", userSchema);
  }
}

module.exports = ContUsersMongoDB;
