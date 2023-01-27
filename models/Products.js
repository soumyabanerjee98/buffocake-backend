const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  metaHead: {
    type: String,
    required: true,
  },
  metaDesc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  catagory: {
    type: String,
    required: true,
  },
  unitValue: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Products", ProductSchema);
