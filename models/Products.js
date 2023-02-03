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
    default: null,
  },
  minWeight: {
    type: Number,
    default: 1,
  },
  availableFlavours: [
    {
      flavour: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  customOptions: [
    {
      option: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Products", ProductSchema);
