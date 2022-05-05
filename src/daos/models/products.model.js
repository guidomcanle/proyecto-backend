const { Schema } = require("mongoose");

const productosSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = productosSchema;
