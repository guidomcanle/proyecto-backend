class ContenedorMongoDb {
  constructor(collection, schema) {
    this.collection = mongoose.model(collection, schema);
  }

  async findById(id) {
    return await this.collection.find({ _id: id });
  }

  async findAll() {
    return await this.collection.find();
  }

  async deleteById(id) {
    return await this.collection.delectOne({ _id: id });
  }

  async deletAll() {
    return await this.collection.deleteMany();
  }
}

module.exports = ContenedorMongoDb;
