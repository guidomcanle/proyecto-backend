const mongoose = require("mongoose");

async function CRUD() {
  try {
    mongoose.connect(
      "mongodb+srv://guidocanle:eRqPhU6dfPk66ED@cluster0.z2lsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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
    console.log(id);
    console.log(await this.collection.find({ _id: id }));
    return await this.collection.find({ _id: id });
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
    console.log(id);
    console.log(info);
    return await this.collection.findOneAndUpdate({ _id: id }, info);
  }
}

module.exports = ContenedorMongoDb;
