const { Schema } = require("mongoose");

const cartSchema = new Schema({
  productos: { type: [], required: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = cartSchema;
