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
  catagory: [
    {
      catagoryId: {
        type: String,
        required: true,
      },
      catagoryName: {
        type: String,
        required: true,
      },
    },
  ],
  subCatagory: [
    {
      subCatagoryId: {
        type: String,
        required: true,
      },
      subCatagoryName: {
        type: String,
        required: true,
      },
    },
  ],
  productImage: [
    {
      mediaPath: {
        type: String,
        default: null,
      },
    },
  ],
  weight: [
    {
      label: {
        type: Number,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
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
  gourmetOptions: [
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
  sameDay: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Products", ProductSchema);
