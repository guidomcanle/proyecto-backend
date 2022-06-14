const mongoose = require("mongoose");
const config = require("../config");

async function CRUD() {
  try {
    mongoose.connect(config.MONGODB_CONTAINER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a mongoDB");
  } catch (e) {
    console.log(e);
  }
}

CRUD();

class ContenedorMongoDb {
  constructor(collection, schema) {
    this.collection = mongoose.model(collection, schema);
  }

  async getById(id) {
    return await this.collection.findOne({ _id: id });
  }

  async getAll() {
    return await this.collection.find();
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: id });
  }

  async deleteAll() {
    return await this.collection.deleteMany();
  }

  async save(x) {
    return await this.collection.insertMany(x);
  }

  async update(id, info) {
    return await this.collection.updateOne({ _id: id }, info);
  }
}

module.exports = ContenedorMongoDb;
