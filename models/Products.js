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
  productImage: {
    type: String,
    required: true,
    default: null,
  },
  minWeight: {
    type: Number,
    required: true,
    default: 1,
  },
  availableFlavours: {
    type: Array,
    required: true,
    default: [],
  },
  customOptions: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Products", ProductSchema);
