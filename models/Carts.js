const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productImage: {
        type: Array,
        default: [],
      },
      qty: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      flavour: {
        type: String,
      },
      custom: {
        type: String,
      },
      message: {
        type: String,
      },
      allergy: {
        type: String,
      },
      delDate: {
        type: String,
        required: true,
      },
      delTime: {
        type: String,
        required: true,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Carts", CartSchema);
